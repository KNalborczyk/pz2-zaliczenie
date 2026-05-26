# Currency Exchange Rates App

## Opis projektu

Aplikacja internetowa do pobierania i wyświetlania kursów walut z API NBP.  
Dane można przeglądać według:
- lat,
- kwartałów,
- miesięcy,
- dni.

Projekt wykorzystuje testy automatyczne oraz kontenery Docker.

# Technologie

- Frontend: Angular i Vitest
- Backend: FastAPI i Pytest
- Baza danych: PostgreSQL
- Docker
- API NBP

# Endpointy API

## GET /currencies
Zwraca listę walut.

## GET /currencies/<date>
Zwraca kursy walut dla wybranej daty.

## POST /currencies/fetch
Pobiera dane z API NBP i zapisuje je do bazy danych.

# Docker

Projekt działa w trzech kontenerach:
- frontend,
- backend,
- baza danych.

Uruchomienie projektu:

```bash
docker compose up --build
```

Uruchomienie testów backendu:

```bash
docker compose exec backend pytest
```

Uruchomienie testów frontendu:

```bash
docker compose run --rm frontend npm test
```

# Adresy

Frontend:
```text
http://localhost:4200
```

Backend:
```text
http://localhost:8000
```

# Cel projektu

- Nauka pracy z Angular i FastAPI
- Integracja z API NBP
- Testowanie aplikacji
- Konteneryzacja aplikacji przy użyciu Dockera