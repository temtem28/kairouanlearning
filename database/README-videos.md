# Intégration des Vidéos — Kairouan Classroom

## Assignation des 3 vidéos aux leçons

| Fichier MP4 | Cours | Leçon | ID SQL |
|-------------|-------|-------|--------|
| `WhatsApp Video 2026-04-28 at 05.19.12.mp4` | Sira — Biographie du Prophète ﷺ | Présentation du cours | `lez-sira-1-1` |
| `WhatsApp Video 2026-04-28 at 05.19.12 (1).mp4` | Croyance — Risala d'Ibn Abi Zayd | Présentation de la Risala | `lez-risala-1-1` |
| `WhatsApp Video 2026-04-28 at 05.19.12 (2).mp4` | Croyance — Risala d'Ibn Abi Zayd | Le Bismillah et l'ouverture | `lez-risala-1-2` |

---

## Étapes BunnyStream

1. Connectez-vous sur **bunny.net → Stream**
2. Créez une **Video Library** (ex : "Kairouan Classroom")
3. Notez votre **Library ID** (visible dans l'URL)
4. Uploadez chaque MP4 → notez les **Video IDs** générés
5. Activez **Token Authentication** (protection anti-téléchargement)

---

## SQL à exécuter dans Supabase après upload

```sql
-- Remplacez LIBRARY_ID et VIDEO_ID_X par vos vrais IDs BunnyStream

-- Vidéo 1 → Sira, leçon d'introduction
UPDATE lms_lessons
SET video_url = 'https://iframe.mediadelivery.net/embed/LIBRARY_ID/VIDEO_ID_1?autoplay=false&preload=false'
WHERE id = 'lez-sira-1-1';

-- Vidéo 2 → Croyance/Risala, présentation
UPDATE lms_lessons
SET video_url = 'https://iframe.mediadelivery.net/embed/LIBRARY_ID/VIDEO_ID_2?autoplay=false&preload=false'
WHERE id = 'lez-risala-1-1';

-- Vidéo 3 → Croyance/Risala, le Bismillah
UPDATE lms_lessons
SET video_url = 'https://iframe.mediadelivery.net/embed/LIBRARY_ID/VIDEO_ID_3?autoplay=false&preload=false'
WHERE id = 'lez-risala-1-2';
```

---

## Ordre d'exécution SQL dans Supabase

1. `database/schema.sql` (une seule fois — crée les tables)
2. `database/demo-courses.sql` (crée les 4 cours de démo)
3. Les 3 `UPDATE` ci-dessus (après upload BunnyStream)
4. `UPDATE ecom_customers SET role = 'admin' WHERE email = 'votre@email.com';`
