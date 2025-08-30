import requests
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime
import os
import re
import sys
import random


class DreamGuildsUpdater:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'pl-PL,pl;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
        })
        self.dream_ladder_url = "https://www.margonem.pl/ladder/guilds,Dream"
        self.base_url = "https://www.margonem.pl"
        self.errors = []

    def log(self, message, level="INFO"):
        """Logowanie z timestampem i poziomem"""
        timestamp = datetime.now().strftime('%H:%M:%S')
        print(f"[{timestamp}] [{level}] {message}")

        if level == "ERROR":
            self.errors.append(f"{timestamp}: {message}")

    def random_delay(self, min_seconds=15, max_seconds=30):
        """Losowy delay między requestami"""
        delay = random.uniform(min_seconds, max_seconds)
        self.log(f"⏳ Czekam {delay:.1f} sekund...")
        time.sleep(delay)

    def safe_request(self, url, timeout=30, retries=3):
        """Bezpieczne wykonanie requesta z retry i dłuższymi opóźnieniami"""
        for attempt in range(retries):
            try:
                self.log(f"Request to {url} (attempt {attempt + 1}/{retries})")
                
                # Dodaj losowe opóźnienie przed każdym requestem
                if attempt > 0:
                    retry_delay = random.uniform(30, 60)  # 30-60 sekund między retry
                    self.log(f"⏳ Retry delay: {retry_delay:.1f} sekund...")
                    time.sleep(retry_delay)
                
                response = self.session.get(url, timeout=timeout)
                response.raise_for_status()
                
                # Dodatkowy delay po udanym requeście
                post_request_delay = random.uniform(3, 8)
                time.sleep(post_request_delay)
                
                return response
                
            except requests.exceptions.RequestException as e:
                self.log(f"Request failed (attempt {attempt + 1}): {e}", "ERROR")
                if attempt < retries - 1:
                    wait_time = (2 ** attempt) * random.uniform(10, 20)  # Exponential backoff z randomizacją
                    self.log(f"Retrying in {wait_time:.1f} seconds...")
                    time.sleep(wait_time)
                else:
                    raise

    def validate_guild_name(self, name):
        """Walidacja nazwy klanu"""
        if not name or len(name.strip()) < 2:
            return False

        name = name.strip()

        # Blacklista nieprawidłowych nazw
        invalid_names = {
            'klan', 'nazwa', 'guild', 'name', '#', '', 'brak',
            'none', 'null', 'undefined', '---', 'n/a'
        }

        return (name.lower() not in invalid_names and
                not name.isdigit() and
                len(name) < 50 and
                not re.match(r'^[#\-_\s]+$', name))

    def validate_player_name(self, name):
        """Walidacja nicku gracza"""
        if not name or len(name.strip()) < 2:
            return False

        name = name.strip()

        # Blacklista nieprawidłowych nicków
        invalid_names = {
            'nick', 'nazwa', 'player', 'gracz', 'name', '#', '',
            'brak', 'none', 'null', 'undefined', '---', 'n/a'
        }

        return (name.lower() not in invalid_names and
                not name.isdigit() and
                1 < len(name) < 30 and
                '#' not in name and
                not re.match(r'^[#\-_\s]+$', name))

    def get_dream_guilds(self):
        """Pobiera listę klanów ze świata Dream"""
        self.log("🔍 Pobieranie klanów ze świata Dream...")

        try:
            response = self.safe_request(self.dream_ladder_url)
            soup = BeautifulSoup(response.content, 'html.parser')

            guilds = []
            table = soup.find('table')

            if not table:
                self.log("❌ Nie znaleziono tabeli rankingu!", "ERROR")
                return []

            rows = table.find_all('tr')[1:]  # Pomiń nagłówek
            self.log(f"📊 Analizuję {len(rows)} wierszy...")

            for i, row in enumerate(rows, 1):
                cells = row.find_all('td')

                if len(cells) < 2:
                    continue

                # Druga kolumna = nazwa klanu
                name_cell = cells[1]
                guild_link = name_cell.find('a', href=re.compile(r'/guilds/view'))

                if guild_link:
                    guild_name = guild_link.get_text().strip()
                    href = guild_link.get('href')

                    if self.validate_guild_name(guild_name):
                        full_url = f"{self.base_url}{href}" if href.startswith('/') else href
                        guilds.append({
                            'name': guild_name,
                            'url': full_url,
                            'rank': i,
                            'has_link': True
                        })
                        self.log(f"  {i:2d}. {guild_name}")
                else:
                    # Fallback - tylko nazwa bez linku
                    guild_name = name_cell.get_text().strip()
                    if self.validate_guild_name(guild_name):
                        # Spróbuj stworzyć URL
                        encoded_name = requests.utils.quote(guild_name)
                        url = f"{self.base_url}/guilds/view,{encoded_name},Dream"

                        guilds.append({
                            'name': guild_name,
                            'url': url,
                            'rank': i,
                            'has_link': False
                        })
                        self.log(f"  {i:2d}. {guild_name} (bez linku)")

            self.log(f"✅ Znaleziono {len(guilds)} klanów")
            return guilds

        except Exception as e:
            self.log(f"❌ Błąd pobierania listy klanów: {e}", "ERROR")
            return []

    def scrape_guild_members(self, guild):
        """Scrappuje członków konkretnego klanu"""
        self.log(f"📊 Scrappuję: {guild['name']}")

        try:
            response = self.safe_request(guild['url'])
            soup = BeautifulSoup(response.content, 'html.parser')

            members = []
            table = soup.find('table')

            if not table:
                self.log(f"⚠️  Brak tabeli: {guild['name']}")
                return []

            # Znajdź kolumnę z nickami - sprawdź nagłówki
            nick_column = 1  # Domyślnie druga kolumna

            header_row = table.find('tr')
            if header_row:
                headers = header_row.find_all(['th', 'td'])
                for i, header in enumerate(headers):
                    header_text = header.get_text().strip().lower()
                    if any(keyword in header_text for keyword in ['nick', 'nazwa', 'player', 'gracz']):
                        nick_column = i
                        self.log(f"  📍 Kolumna nicków: {i} ({header_text})")
                        break

            # Pobierz członków
            rows = table.find_all('tr')[1:]  # Pomiń nagłówek

            for row in rows:
                cells = row.find_all('td')

                if len(cells) > nick_column:
                    nick_cell = cells[nick_column]

                    # Sprawdź czy jest link
                    link = nick_cell.find('a')
                    player_name = link.get_text().strip() if link else nick_cell.get_text().strip()

                    # Walidacja i dodanie nicku
                    if self.validate_player_name(player_name) and player_name not in members:
                        members.append(player_name)

            self.log(f"  ✓ {len(members)} członków")
            return members

        except Exception as e:
            self.log(f"❌ Błąd scrappowania {guild['name']}: {e}", "ERROR")
            return []

    def save_backup(self, data):
        """Zapisz backup danych"""
        try:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_file = f"guilds_backup_{timestamp}.json"

            with open(backup_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2, sort_keys=True)

            self.log(f"💾 Backup zapisany: {backup_file}")
            return backup_file
        except Exception as e:
            self.log(f"❌ Błąd zapisu backup: {e}", "ERROR")
            return None

    def load_existing_data(self):
        """Wczytaj istniejące dane jeśli istnieją"""
        try:
            if os.path.exists('guilds.json'):
                with open('guilds.json', 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.log(f"📂 Wczytano istniejące dane: {len(data)} graczy")
                    return data
        except Exception as e:
            self.log(f"⚠️  Błąd wczytywania istniejących danych: {e}")

        return {}

    def update_guilds_json(self):
        """Główna funkcja - aktualizuje guilds.json"""
        self.log("🚀 Rozpoczynam aktualizację guilds.json")
        self.log("⏳ UWAGA: Proces będzie bardzo wolny (15-30s między requestami)")

        # Wczytaj istniejące dane
        existing_data = self.load_existing_data()

        # Pobierz listę klanów
        guilds = self.get_dream_guilds()

        if not guilds:
            self.log("❌ Brak klanów do przetworzenia!", "ERROR")
            return False

        # Scrappuj wszystkich członków
        player_guild_mapping = {}
        successful_guilds = 0
        total_members = 0

        # Wymieszaj listę klanów, żeby kolejność była losowa
        random.shuffle(guilds)

        for i, guild in enumerate(guilds, 1):
            self.log(f"\n[{i:2d}/{len(guilds)}] {guild['name']}")

            members = self.scrape_guild_members(guild)

            if members:
                successful_guilds += 1
                total_members += len(members)

                # Dodaj mapowanie nick -> klan (małe litery dla nicków jako klucze)
                for member in members:
                    player_guild_mapping[member.lower()] = guild['name']
            else:
                self.log(f"⚠️  Brak członków dla {guild['name']}")

            # Długa przerwa między klanami - respektujmy serwer
            if i < len(guilds):
                self.random_delay(25, 45)  # 25-45 sekund między klanami

        if not player_guild_mapping:
            self.log("❌ Nie udało się pobrać żadnych danych!", "ERROR")
            return False

        # Porównaj z istniejącymi danymi
        changes_count = 0
        if existing_data:
            for nick, guild in player_guild_mapping.items():
                if nick not in existing_data or existing_data[nick] != guild:
                    changes_count += 1

            # Sprawdź usuniętych graczy
            for nick in existing_data:
                if nick not in player_guild_mapping:
                    changes_count += 1

        # Zapisz backup przed zmianami
        if existing_data and changes_count > 0:
            self.save_backup(existing_data)

        # Zapisz nowe dane do guilds.json
        try:
            with open('guilds.json', 'w', encoding='utf-8') as f:
                json.dump(player_guild_mapping, f, ensure_ascii=False, indent=2, sort_keys=True)
        except Exception as e:
            self.log(f"❌ Błąd zapisu guilds.json: {e}", "ERROR")
            return False

        # Walidacja zapisanego pliku
        try:
            with open('guilds.json', 'r', encoding='utf-8') as f:
                test_data = json.load(f)
                if len(test_data) != len(player_guild_mapping):
                    raise ValueError("Niezgodna liczba rekordów po zapisie")
        except Exception as e:
            self.log(f"❌ Błąd walidacji guilds.json: {e}", "ERROR")
            return False

        # Podsumowanie
        self.log(f"\n🎉 Aktualizacja zakończona!")
        self.log(f"📊 Klany: {successful_guilds}/{len(guilds)} ({successful_guilds / len(guilds) * 100:.1f}%)")
        self.log(f"👥 Graczy: {len(player_guild_mapping)}")
        self.log(f"🔄 Zmian: {changes_count}")
        self.log(f"💾 Zapisano: guilds.json")

        if self.errors:
            self.log(f"⚠️  Wystąpiło {len(self.errors)} błędów podczas procesu")
            for error in self.errors[-5:]:  # Pokaż ostatnie 5 błędów
                self.log(f"   - {error}")

        return True


def main():
    """Uruchom aktualizację"""
    updater = DreamGuildsUpdater()

    try:
        success = updater.update_guilds_json()

        if success:
            updater.log("✅ Proces zakończony sukcesem")
            sys.exit(0)
        else:
            updater.log("❌ Proces zakończony niepowodzeniem", "ERROR")
            sys.exit(1)

    except KeyboardInterrupt:
        updater.log("⏹️  Proces przerwany przez użytkownika")
        sys.exit(130)
    except Exception as e:
        updater.log(f"💥 Nieoczekiwany błąd: {e}", "ERROR")
        sys.exit(1)


if __name__ == "__main__":
    main()
