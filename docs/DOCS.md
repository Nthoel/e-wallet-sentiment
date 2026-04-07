# E-Wallet Sentiment API

> Version: 0.1.0

API dokumentasi untuk E-Wallet Sentiment Analysis Platform. Platform ini menyediakan fitur analisis sentimen review e-wallet dari Google Play Store.

## Base URL

- `http://localhost:3001` — Backend Server

## Table of Contents

- [Health](#health) — Health check endpoint
- [Auth](#auth) — Autentikasi dan manajemen user
- [Reviews](#reviews) — Manajemen review e-wallet
- [Schemas](#schemas)

---

## Endpoints

### Health

Health check endpoint

#### `GET /api/health`

**Health check**

Mengecek apakah backend server berjalan dengan baik.



**Responses**

- **200**: Server berjalan normal
  - Schema: [HealthResponse](####HealthResponse)

---

### Auth

Autentikasi dan manajemen user

#### `POST /api/auth/login`

**Login user**

Login menggunakan username/email dan password. Mengembalikan access token dan refresh token.


**Request Body** *(required)*

Schema: [LoginRequest](####LoginRequest)

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| username | string | Tidak | Username (wajib salah satu username atau email) | `johndoe` |
| email | string (email) | Tidak | Email (wajib salah satu username atau email) | `john@example.com` |
| password | string | Ya | Password user | `password123` |

**Responses**

- **200**: Login berhasil
  - Schema: [LoginResponse](####LoginResponse)
- **400**: Validasi gagal
  - Schema: [ValidationErrorResponse](####ValidationErrorResponse)
- **401**: Email/Username atau password salah
  - Schema: [ErrorResponse](####ErrorResponse)

---

#### `POST /api/auth/register`

**Register user baru**

Mendaftarkan user baru dengan username, email, dan password.


**Request Body** *(required)*

Schema: [RegisterRequest](####RegisterRequest)

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| username | string | Ya | Username minimal 3 karakter | `johndoe` |
| email | string (email) | Ya | Email yang valid | `john@example.com` |
| password | string | Ya | Password minimal 6 karakter | `password123` |

**Responses**

- **201**: Registrasi berhasil
  - Schema: [RegisterResponse](####RegisterResponse)
- **400**: Validasi gagal
  - Schema: [ValidationErrorResponse](####ValidationErrorResponse)
- **409**: Email atau username sudah terdaftar
  - Schema: [ErrorResponse](####ErrorResponse)

---

#### `POST /api/auth/forget-password`

**Request reset password**

Mengirim email berisi link reset password.
Selalu mengembalikan 204 No Content untuk keamanan
(tidak memberi tahu apakah email terdaftar atau tidak).



**Request Body** *(required)*

Schema: [ForgetPasswordRequest](####ForgetPasswordRequest)

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| email | string (email) | Ya | Email terdaftar untuk reset password | `john@example.com` |

**Responses**

- **204**: Request berhasil diproses (email dikirim jika terdaftar)
- **400**: Validasi gagal (email tidak valid)
  - Schema: [ErrorResponse](####ErrorResponse)

---

### Reviews

Manajemen review e-wallet

#### `GET /api/reviews`

**Ambil daftar review**

Mengambil daftar review dengan pagination, filter, dan sorting.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| page | query | `integer (default: 1) min: 1` | Tidak | Nomor halaman |
| limit | query | `integer (default: 10) min: 1 max: 100` | Tidak | Jumlah data per halaman |
| source | query | `string` | Tidak | Filter berdasarkan sumber review (e.g. google_play) |
| sentiment_result | query | `string` | Tidak | Filter berdasarkan hasil sentimen (e.g. positive, negative, neutral) |
| is_analyzed | query | `string enum: [true, false]` | Tidak | Filter berdasarkan status analisis |
| sort_order | query | `string enum: [asc, desc] (default: desc)` | Tidak | Urutan sorting berdasarkan created_at |


**Responses**

- **200**: Daftar review berhasil diambil
  - Schema: [GetReviewsResponse](####GetReviewsResponse)
- **400**: Validasi query parameter gagal
  - Schema: [ValidationErrorResponse](####ValidationErrorResponse)

---

#### `POST /api/reviews`

**Buat review baru**

Menambahkan review baru ke database.


**Request Body** *(required)*

Schema: [CreateReviewRequest](####CreateReviewRequest)

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| id | string | Ya | ID unik review | `gp_abc123` |
| user_name | string, nullable | Tidak |  | `John Doe` |
| user_image | string, nullable | Tidak |  |  |
| content | string | Ya | Isi review | `Transaksi cepat dan mudah` |
| score | integer, nullable | Tidak |  | `5` |
| thumbs_up_count | integer, nullable | Tidak |  | `3` |
| review_created_version | string, nullable | Tidak |  |  |
| review_datetime | string (date-time), nullable | Tidak |  |  |
| reply_content | string, nullable | Tidak |  |  |
| replied_at | string (date-time), nullable | Tidak |  |  |
| app_version | string, nullable | Tidak |  |  |
| timestamp_unix | number, nullable | Tidak |  |  |
| timestamp_formatted | string, nullable | Tidak |  |  |
| source | string | Ya | Sumber review | `google_play` |

**Responses**

- **201**: Review berhasil dibuat
  - Schema: [CreateReviewResponse](####CreateReviewResponse)
- **400**: Validasi gagal
  - Schema: [ValidationErrorResponse](####ValidationErrorResponse)

---

## Schemas

#### LoginRequest

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| username | string | Tidak | Username (wajib salah satu username atau email) | `johndoe` |
| email | string (email) | Tidak | Email (wajib salah satu username atau email) | `john@example.com` |
| password | string | Ya | Password user | `password123` |

#### LoginResponse

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| access_token | string | Tidak | JWT access token | `eyJhbGciOiJIUzI1NiIs...` |
| refresh_token | string | Tidak | JWT refresh token | `eyJhbGciOiJIUzI1NiIs...` |

#### RegisterRequest

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| username | string | Ya | Username minimal 3 karakter | `johndoe` |
| email | string (email) | Ya | Email yang valid | `john@example.com` |
| password | string | Ya | Password minimal 6 karakter | `password123` |

#### RegisterResponse

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| success | boolean | Tidak |  | `true` |

#### ForgetPasswordRequest

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| email | string (email) | Ya | Email terdaftar untuk reset password | `john@example.com` |

#### ErrorResponse

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| success | boolean | Tidak |  | `false` |
| message | string | Tidak |  | `Internal Server Error` |
| errors | object | Tidak | Detail error validasi (opsional) |  |
| stack | string | Tidak | Stack trace (hanya muncul di mode development) |  |

#### ValidationErrorResponse

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| success | boolean | Tidak |  | `false` |
| message | string | Tidak |  | `Validation failed` |
| errors | object | Tidak | Detail error per field |  |

#### HealthResponse

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| status | string | Tidak |  | `ok` |
| service | string | Tidak |  | `e-wallet-sentiment-backend` |

#### Review

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| id | string | Tidak | ID unik review | `gp_abc123` |
| user_name | string, nullable | Tidak |  | `John Doe` |
| user_image | string, nullable | Tidak |  | `https://lh3.googleusercontent.com/...` |
| content | string | Tidak | Isi review | `Aplikasi sangat membantu untuk transaksi sehari-hari` |
| score | integer, nullable | Tidak | Rating 1-5 | `4` |
| thumbs_up_count | integer, nullable | Tidak |  | `12` |
| review_created_version | string, nullable | Tidak |  | `3.2.1` |
| review_datetime | string (date-time), nullable | Tidak |  | `2026-03-10T08:30:00.000Z` |
| reply_content | string, nullable | Tidak |  | `Terima kasih atas ulasannya!` |
| replied_at | string (date-time), nullable | Tidak |  |  |
| app_version | string, nullable | Tidak |  | `3.2.1` |
| timestamp_unix | number, nullable | Tidak |  | `1773350400` |
| timestamp_formatted | string, nullable | Tidak |  | `2026-03-10 08:00:00` |
| source | string | Tidak | Sumber review (e.g. google_play, app_store) | `google_play` |
| is_analyzed | boolean, nullable | Tidak | Apakah sudah dianalisis sentimen | `false` |
| sentiment_result | string, nullable | Tidak | Hasil analisis sentimen | `positive` |
| confidence_score | number (float), nullable | Tidak | Skor confidence analisis sentimen (0-1) | `0.92` |
| createdAt | string (date-time) | Tidak |  | `2026-03-10T08:30:00.000Z` |

#### GetReviewsResponse

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| status | string | Tidak |  | `success` |
| total_results | integer | Tidak |  | `150` |
| data | [Review](####Review)[] | Tidak |  |  |
| &nbsp;&nbsp;↳ id | string | Tidak | ID unik review | `gp_abc123` |
| &nbsp;&nbsp;↳ user_name | string, nullable | Tidak |  | `John Doe` |
| &nbsp;&nbsp;↳ user_image | string, nullable | Tidak |  | `https://lh3.googleusercontent.com/...` |
| &nbsp;&nbsp;↳ content | string | Tidak | Isi review | `Aplikasi sangat membantu untuk transaksi sehari-hari` |
| &nbsp;&nbsp;↳ score | integer, nullable | Tidak | Rating 1-5 | `4` |
| &nbsp;&nbsp;↳ thumbs_up_count | integer, nullable | Tidak |  | `12` |
| &nbsp;&nbsp;↳ review_created_version | string, nullable | Tidak |  | `3.2.1` |
| &nbsp;&nbsp;↳ review_datetime | string (date-time), nullable | Tidak |  | `2026-03-10T08:30:00.000Z` |
| &nbsp;&nbsp;↳ reply_content | string, nullable | Tidak |  | `Terima kasih atas ulasannya!` |
| &nbsp;&nbsp;↳ replied_at | string (date-time), nullable | Tidak |  |  |
| &nbsp;&nbsp;↳ app_version | string, nullable | Tidak |  | `3.2.1` |
| &nbsp;&nbsp;↳ timestamp_unix | number, nullable | Tidak |  | `1773350400` |
| &nbsp;&nbsp;↳ timestamp_formatted | string, nullable | Tidak |  | `2026-03-10 08:00:00` |
| &nbsp;&nbsp;↳ source | string | Tidak | Sumber review (e.g. google_play, app_store) | `google_play` |
| &nbsp;&nbsp;↳ is_analyzed | boolean, nullable | Tidak | Apakah sudah dianalisis sentimen | `false` |
| &nbsp;&nbsp;↳ sentiment_result | string, nullable | Tidak | Hasil analisis sentimen | `positive` |
| &nbsp;&nbsp;↳ confidence_score | number (float), nullable | Tidak | Skor confidence analisis sentimen (0-1) | `0.92` |
| &nbsp;&nbsp;↳ createdAt | string (date-time) | Tidak |  | `2026-03-10T08:30:00.000Z` |

#### CreateReviewRequest

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| id | string | Ya | ID unik review | `gp_abc123` |
| user_name | string, nullable | Tidak |  | `John Doe` |
| user_image | string, nullable | Tidak |  |  |
| content | string | Ya | Isi review | `Transaksi cepat dan mudah` |
| score | integer, nullable | Tidak |  | `5` |
| thumbs_up_count | integer, nullable | Tidak |  | `3` |
| review_created_version | string, nullable | Tidak |  |  |
| review_datetime | string (date-time), nullable | Tidak |  |  |
| reply_content | string, nullable | Tidak |  |  |
| replied_at | string (date-time), nullable | Tidak |  |  |
| app_version | string, nullable | Tidak |  |  |
| timestamp_unix | number, nullable | Tidak |  |  |
| timestamp_formatted | string, nullable | Tidak |  |  |
| source | string | Ya | Sumber review | `google_play` |

#### CreateReviewResponse

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| success | boolean | Tidak |  | `true` |
| message | string | Tidak |  | `Review created successfully` |
| data | object | Tidak |  |  |
| &nbsp;&nbsp;↳ id | string | Tidak | ID unik review | `gp_abc123` |
| &nbsp;&nbsp;↳ user_name | string, nullable | Tidak |  | `John Doe` |
| &nbsp;&nbsp;↳ user_image | string, nullable | Tidak |  | `https://lh3.googleusercontent.com/...` |
| &nbsp;&nbsp;↳ content | string | Tidak | Isi review | `Aplikasi sangat membantu untuk transaksi sehari-hari` |
| &nbsp;&nbsp;↳ score | integer, nullable | Tidak | Rating 1-5 | `4` |
| &nbsp;&nbsp;↳ thumbs_up_count | integer, nullable | Tidak |  | `12` |
| &nbsp;&nbsp;↳ review_created_version | string, nullable | Tidak |  | `3.2.1` |
| &nbsp;&nbsp;↳ review_datetime | string (date-time), nullable | Tidak |  | `2026-03-10T08:30:00.000Z` |
| &nbsp;&nbsp;↳ reply_content | string, nullable | Tidak |  | `Terima kasih atas ulasannya!` |
| &nbsp;&nbsp;↳ replied_at | string (date-time), nullable | Tidak |  |  |
| &nbsp;&nbsp;↳ app_version | string, nullable | Tidak |  | `3.2.1` |
| &nbsp;&nbsp;↳ timestamp_unix | number, nullable | Tidak |  | `1773350400` |
| &nbsp;&nbsp;↳ timestamp_formatted | string, nullable | Tidak |  | `2026-03-10 08:00:00` |
| &nbsp;&nbsp;↳ source | string | Tidak | Sumber review (e.g. google_play, app_store) | `google_play` |
| &nbsp;&nbsp;↳ is_analyzed | boolean, nullable | Tidak | Apakah sudah dianalisis sentimen | `false` |
| &nbsp;&nbsp;↳ sentiment_result | string, nullable | Tidak | Hasil analisis sentimen | `positive` |
| &nbsp;&nbsp;↳ confidence_score | number (float), nullable | Tidak | Skor confidence analisis sentimen (0-1) | `0.92` |
| &nbsp;&nbsp;↳ createdAt | string (date-time) | Tidak |  | `2026-03-10T08:30:00.000Z` |

#### GetReviewsQueryParams

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| page | integer | Tidak | Nomor halaman |  |
| limit | integer | Tidak | Jumlah data per halaman |  |
| source | string | Tidak | Filter berdasarkan sumber review | `google_play` |
| sentiment_result | string | Tidak | Filter berdasarkan hasil sentimen | `positive` |
| is_analyzed | string enum: [true, false] | Tidak | Filter berdasarkan status analisis |  |
| sort_order | string enum: [asc, desc] | Tidak | Urutan sorting berdasarkan created_at |  |

---

*Generated automatically from OpenAPI spec on 2026-03-12*