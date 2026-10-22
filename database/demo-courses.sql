-- ================================================================
-- KAIROUAN CLASSROOM — 4 Cours de démonstration
-- Instructeur : Ustadh Sayf
-- Exécuter APRÈS database/schema.sql
-- ================================================================
-- NOTE VIDÉOS : Après upload sur BunnyStream, exécuter les UPDATE
-- fournis dans database/README-videos.md
-- ================================================================

-- ── Cours 1 : Sira — Commentaire du Précis dans la Biographie du Prophète ﷺ ──

INSERT INTO ecom_products (id, name, handle, description, price, compare_at_price, product_type, status, images, tags, metadata)
VALUES (
  'demo-cours-sira',
  'Commentaire du Précis dans la Biographie du Prophète ﷺ — Niveau 1',
  'commentaire-precis-biographie-prophete',
  'Étude du Mukhtasar al-Sira de ''Abdelghani Al Maqdisi selon le Manhaj Maliki. Ce cours de niveau 1 vous guide à travers la biographie du Prophète Muhammad ﷺ de manière structurée et méthodique, en s''appuyant sur les sources authentiques.',
  7900,
  9900,
  'Cours',
  'active',
  ARRAY['https://images.unsplash.com/photo-1585468274952-66591eb14165?w=800'],
  ARRAY['populaire', 'debutant', 'sira', 'maliki'],
  '{"instructor": "Ustadh Sayf", "level": "Niveau 1", "duration": "Cours en direct + replay", "lessons_count": 4, "access_days": 365, "text": "Mukhtasar al-Sira de ''Abdelghani Al Maqdisi", "manhaj": "Maliki"}'
) ON CONFLICT (handle) DO NOTHING;

INSERT INTO lms_modules (id, product_id, title, position, sequential_unlock) VALUES
  ('mod-sira-1', 'demo-cours-sira', 'Introduction à la Sira du Prophète ﷺ', 1, true),
  ('mod-sira-2', 'demo-cours-sira', 'La Naissance et l''Enfance du Prophète ﷺ', 2, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO lms_lessons (id, module_id, title, position, duration_minutes, is_free_preview,
  video_url, content, attachments) VALUES
  (
    'lez-sira-1-1',
    'mod-sira-1',
    'Présentation du cours — Le Mukhtasar al-Sira d''Al Maqdisi',
    1, 30, true,
    -- VIDEO 1 : WhatsApp Video 2026-04-28 at 05.19.12.mp4
    -- Après upload BunnyStream → remplacer par :
    -- 'https://iframe.mediadelivery.net/embed/LIBRARY_ID/VIDEO_ID_1'
    NULL,
    E'Bienvenue dans ce cours dispensé par Ustadh Sayf dans le cadre du Kairouan Classroom.\n\n📚 Le texte étudié\n« مختصر السيرة » — Le Précis dans la Biographie du Prophète ﷺ\nde l''Imam Abdelghani Al Maqdisi (m. 600 H)\n\nCe texte concis et rigoureux couvre :\n• La généalogie du Prophète ﷺ\n• Sa naissance et son enfance\n• Les grandes étapes de sa vie avant et après la révélation\n• Les événements marquants de la période mekkoise et médinoise\n\n🎯 Objectifs du cours (Niveau 1)\n1. Connaître la vie du Prophète ﷺ dans ses grandes lignes\n2. Comprendre le contexte historique de la révélation\n3. Tirer des leçons pratiques de la Sira\n4. Développer l''amour pour le Prophète ﷺ à travers la connaissance\n\n📖 Méthodologie\nÉtude selon le Manhaj Maliki, en s''appuyant sur :\n— Al-Muwatta (الموطأ)\n— Al-Mudawwana al-Kubra (المدونة الكبرى)\n— Al-Bayan wal-Tahsil (البيان والتحصيل)',
    '[{"label": "Programme du cours Sira Niveau 1 (PDF)", "url": "#"}, {"label": "Texte original : Mukhtasar al-Sira", "url": "#"}]'::jsonb
  ),
  (
    'lez-sira-1-2',
    'mod-sira-1',
    'La généalogie du Prophète ﷺ — Nasab',
    2, 35, false,
    NULL,
    E'La généalogie du Prophète Muhammad ﷺ (النسب الشريف)\n\nMuhammad ibn Abdillah ibn Abd al-Muttalib ibn Hashim ibn Abd Manaf\n\n📌 La tribu des Quraysh\nLe Prophète ﷺ est issu de la noble tribu des Quraysh, gardienne de la Ka''ba, la plus respectée d''Arabie.\n\n📌 Banu Hashim\nLa famille hashimite était connue pour :\n• Sa générosité (سخاء)\n• Sa noblesse de caractère (شرف)\n• Sa responsabilité de l''approvisionnement en eau des pèlerins (السقاية)\n\n📌 Signification\nIbn Kathir dit : « Allah a choisi Muhammad ﷺ de la meilleure tribu, de la meilleure famille, de la meilleure lignée. »\n\nLe Prophète ﷺ dit : « إنَّ اللهَ اصطفى كِنانةَ من وَلَدِ إسماعيلَ، واصطفى قريشاً من كِنانةَ، واصطفى من قريشٍ بني هاشمٍ، واصطفاني من بني هاشمٍ »',
    '[{"label": "Arbre généalogique du Prophète ﷺ (PDF)", "url": "#"}]'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO lms_lessons (id, module_id, title, position, duration_minutes, is_free_preview,
  video_url, content, attachments) VALUES
  (
    'lez-sira-2-1',
    'mod-sira-2',
    'L''Année de l''Éléphant — Naissance du Prophète ﷺ',
    1, 40, false,
    NULL,
    E'La naissance du Prophète Muhammad ﷺ\n\n📅 Date\nLe Prophète ﷺ est né un lundi, le 12 Rabi'' al-Awwal de l''Année de l''Éléphant\n(correspondant à 570 ou 571 de l''ère chrétienne)\n\n🐘 L''Année de l''Éléphant\nQuelques semaines avant sa naissance, l''armée d''Abraha, roi du Yémen, tenta de détruire la Ka''ba avec des éléphants. Allah envoya des oiseaux (أبابيل) portant des pierres d''argile qui détruisirent l''armée.\n\nAllah dit dans le Coran :\n« أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ »\n— "N''as-tu pas vu comment ton Seigneur a agi avec les gens de l''Éléphant ?" (Sourate Al-Fil)\n\n🌟 Les signes accompagnant sa naissance\nLa mère du Prophète ﷺ, Amina bint Wahb, rapporta qu''une lumière surgit d''elle à la naissance, illuminant les châteaux de Busra en Syrie.',
    '[{"label": "Carte géographique de l''Arabie à l''époque du Prophète ﷺ", "url": "#"}]'::jsonb
  ),
  (
    'lez-sira-2-2',
    'mod-sira-2',
    'L''enfance du Prophète ﷺ — Halima al-Sa''diyya',
    2, 35, false,
    NULL,
    E'L''allaitement et l''enfance du Prophète ﷺ\n\n👶 Halima al-Sa''diyya\nSelon la tradition arabe, les enfants nobles étaient confiés à des nourrices bédouines. Le Prophète ﷺ fut confié à Halima bint Abi Dhu''ayb al-Sa''diyya.\n\nDès que Halima prit l''enfant Muhammad ﷺ :\n• Son chamelle stérile donna du lait\n• Ses brebis devinrent abondantes en lait\n• Sa famille connut une prospérité inhabituelle\n\n✨ L''ouverture de la poitrine (شرح الصدر)\nÀ l''âge de 4 ou 5 ans, deux anges vinrent au Prophète ﷺ, ouvrirent sa poitrine, en retirèrent le cœur, le purifièrent et le remirent à sa place. Halima, prise de peur, le ramena à sa mère Amina.\n\n📌 Le retour à La Mecque\nLe Prophète ﷺ vécut à La Mecque. Sa mère Amina décéda alors qu''il avait 6 ans. Son grand-père Abd al-Muttalib le prit en charge, puis décéda à son tour quand le Prophète ﷺ avait 8 ans. C''est son oncle Abu Talib qui en prit la tutelle.',
    NULL
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO lms_quizzes (id, product_id, module_id, title, passing_score, max_attempts) VALUES
  ('quiz-sira-1', 'demo-cours-sira', 'mod-sira-1', 'Quiz : Introduction à la Sira', 70, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO lms_quiz_questions (id, quiz_id, question, options, correct_answer, position) VALUES
  ('qz-s1-1', 'quiz-sira-1', 'Qui est l''auteur du Mukhtasar al-Sira étudié dans ce cours ?',
   '["Ibn Hisham", "Ibn Kathir", "''Abdelghani Al Maqdisi", "Al-Nawawi"]'::jsonb, 2, 1),
  ('qz-s1-2', 'quiz-sira-1', 'De quelle tribu est issu le Prophète Muhammad ﷺ ?',
   '["Banu Tamim", "Aws", "Quraysh", "Khazraj"]'::jsonb, 2, 2),
  ('qz-s1-3', 'quiz-sira-1', 'Comment appelle-t-on l''année de naissance du Prophète ﷺ ?',
   '["L''Année de la Révélation", "L''Année de l''Éléphant", "L''Année de l''Hégire", "L''Année de la Victoire"]'::jsonb, 1, 3),
  ('qz-s1-4', 'quiz-sira-1', 'Qui était la nourrice du Prophète ﷺ ?',
   '["Khadija bint Khuwaylid", "Amina bint Wahb", "Halima al-Sa''diyya", "Fatima bint Asad"]'::jsonb, 2, 4)
ON CONFLICT (id) DO NOTHING;


-- ── Cours 2 : Croyance — Commentaire de l'Introduction de la Risala d'Ibn Abi Zayd ──

INSERT INTO ecom_products (id, name, handle, description, price, compare_at_price, product_type, status, images, tags, metadata)
VALUES (
  'demo-cours-risala',
  'Croyance — Commentaire de l''Introduction de la Risala d''Ibn Abi Zayd — Niveau 1',
  'croyance-commentaire-risala-ibn-abi-zayd',
  'Étude commentée de l''introduction de la Risala d''Ibn Abi Zayd al-Qayrawani (م. 386 H), texte fondateur de l''école Maliki. Cette introduction contient les bases de la croyance islamique (Aqida) selon la tradition sunnite ash''arite.',
  6900,
  8900,
  'Cours',
  'active',
  ARRAY['https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800'],
  ARRAY['populaire', 'debutant', 'aqida', 'maliki'],
  '{"instructor": "Ustadh Sayf", "level": "Niveau 1", "duration": "Cours en direct + replay", "lessons_count": 4, "access_days": 365, "text": "Risala d''Ibn Abi Zayd al-Qayrawani", "manhaj": "Maliki"}'
) ON CONFLICT (handle) DO NOTHING;

INSERT INTO lms_modules (id, product_id, title, position, sequential_unlock) VALUES
  ('mod-risala-1', 'demo-cours-risala', 'Les Bases de la Croyance — Introduction de la Risala', 1, true),
  ('mod-risala-2', 'demo-cours-risala', 'Les Attributs d''Allah et les Obligations du Croyant', 2, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO lms_lessons (id, module_id, title, position, duration_minutes, is_free_preview,
  video_url, content, attachments) VALUES
  (
    'lez-risala-1-1',
    'mod-risala-1',
    'Présentation de la Risala d''Ibn Abi Zayd al-Qayrawani',
    1, 30, true,
    -- VIDEO 2 : WhatsApp Video 2026-04-28 at 05.19.12 (1).mp4
    -- Après upload BunnyStream → remplacer par :
    -- 'https://iframe.mediadelivery.net/embed/LIBRARY_ID/VIDEO_ID_2'
    NULL,
    E'Bienvenue dans ce cours de Croyance dispensé par Ustadh Sayf — Kairouan Classroom.\n\n📚 Le texte étudié\n« الرسالة » de l''Imam Abu Muhammad Abdallah ibn Abi Zayd al-Qayrawani\n(né à Kairouan, Tunisie — m. 386 H / 996 ap. J.-C.)\n\nIbn Abi Zayd al-Qayrawani est surnommé « le Petit Malik » (مالك الصغير) en raison de la profondeur de son attachement au madhab maliki.\n\n🌟 Importance de la Risala\nLa Risala est l''un des textes fondateurs de l''école Maliki. Son introduction est unique car elle commence par :\n• Un exposé complet de l''Aqida sunnite\n• Les obligations du cœur envers Allah\n• Les piliers de la foi et leur signification\n\nIbn Abi Zayd dit : « Les sciences les plus nobles sont la connaissance d''Allah par Ses attributs, la connaissance de ce qu''Il a rendu obligatoire, et la mise en pratique de ce qu''Il a prescrit. »\n\n📖 Connexion avec Kairouan\nIbn Abi Zayd al-Qayrawani vécut et enseigna à Kairouan (Tunisie), ville qui donna son nom à notre académie et fut l''un des grands centres de diffusion de l''Islam en Occident.',
    '[{"label": "Texte intégral de la Risala (bilingue arabe/français)", "url": "#"}, {"label": "Biographie d''Ibn Abi Zayd al-Qayrawani", "url": "#"}]'::jsonb
  ),
  (
    'lez-risala-1-2',
    'mod-risala-1',
    'Le Bismillah et l''ouverture de la Risala',
    2, 35, false,
    -- VIDEO 3 : WhatsApp Video 2026-04-28 at 05.19.12 (2).mp4
    -- Après upload BunnyStream → remplacer par :
    -- 'https://iframe.mediadelivery.net/embed/LIBRARY_ID/VIDEO_ID_3'
    NULL,
    E'Ibn Abi Zayd commence sa Risala par :\n\nبِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ\n\nPuis il énonce le fondement de la croyance :\n\n« وَمِمَّا أَجْمَعَ عَلَيْهِ أَهْلُ السُّنَّةِ : أَنَّ اللهَ سُبْحَانَهُ أَزَلِيٌّ لَا ابْتِدَاءَ لِوُجُودِهِ »\n— "Parmi ce sur quoi les gens de la Sunna sont unanimes : Allah est Pré-éternel, Son existence n''a pas de commencement."\n\n🔍 Explication des premiers attributs mentionnés\n\n1. الأزلية — La Pré-éternité\nAllah existait avant toute chose, sans commencement.\n\n2. الأبدية — La Post-éternité\nAllah existera après toute chose, sans fin.\n\n3. القِيامُ بِنَفْسِه — L''auto-subsistance\nAllah n''a besoin de rien ni de personne. Toute chose a besoin de Lui.\n\n4. المخالفة للحوادث — La différence avec les créatures\nAllah ne ressemble à rien de ce que nous connaissons.\n\n📌 Point crucial\nIbn Abi Zayd insiste : la connaissance de l''Aqida est une obligation individuelle (فرض عين) pour tout musulman.',
    '[{"label": "Fiche : Les attributs d''Allah dans la Risala (PDF)", "url": "#"}]'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO lms_lessons (id, module_id, title, position, duration_minutes, is_free_preview,
  video_url, content, attachments) VALUES
  (
    'lez-risala-2-1',
    'mod-risala-2',
    'Les attributs obligatoires d''Allah — Al-Sifat al-Wajiba',
    1, 40, false,
    NULL,
    E'Ibn Abi Zayd al-Qayrawani présente dans sa Risala les attributs qu''il est obligatoire de connaître et de croire concernant Allah.\n\n📌 Les 13 attributs obligatoires (selon la tradition ash''arite)\n\n① الوجود — L''Existence\n② القِدَم — La Pré-éternité\n③ البقاء — La Post-éternité\n④ المخالفة للحوادث — La différence d''avec les créatures\n⑤ القيام بالنفس — L''auto-subsistance\n⑥ الوحدانية — L''Unicité\n⑦ القدرة — La Toute-Puissance\n⑧ الإرادة — La Volonté\n⑨ العلم — La Connaissance\n⑩ الحياة — La Vie\n⑪ السمع — L''Ouïe\n⑫ البصر — La Vue\n⑬ الكلام — La Parole\n\n📌 Les attributs impossibles (ضدّها)\nChaque attribut obligatoire a son contraire impossible :\nEx. : Il est impossible qu''Allah soit inexistant (العدم), qu''Il ait un commencement, ou qu''Il ressemble aux créatures.',
    '[{"label": "Tableau des 13 attributs obligatoires (PDF)", "url": "#"}]'::jsonb
  ),
  (
    'lez-risala-2-2',
    'mod-risala-2',
    'La foi aux Anges, aux Livres et aux Messagers',
    2, 35, false,
    NULL,
    E'Suite de l''étude de l''introduction de la Risala d''Ibn Abi Zayd.\n\n👼 La foi aux Anges (الإيمان بالملائكة)\nLes anges sont des êtres de lumière, créés d''une lumière pure, qui n''ont ni sexe ni nourritures, et qui obéissent parfaitement à Allah.\n\nParmi les anges les plus importants :\n• جبريل (Gabriel) — apporte la révélation\n• ميكائيل (Mikail) — préposé aux pluies et à la végétation\n• إسرافيل (Israfil) — soufflera dans la Trompette au Jour Dernier\n• عزرائيل (''Azra''il) — l''Ange de la mort\n\n📖 La foi aux Livres révélés (الإيمان بالكتب)\n• التوراة (la Torah) — révélée à Musa ﷺ\n• الإنجيل (l''Évangile) — révélé à ''Isa ﷺ\n• الزبور (les Psaumes) — révélés à Dawud ﷺ\n• القرآن الكريم — révélé à Muhammad ﷺ, dernier et préservé\n\n📌 Les Messagers (الرسل)\nAllah a envoyé des prophètes à chaque nation. Nous croyons en tous, sans distinction. Le premier est Adam ﷺ et le dernier est Muhammad ﷺ, le sceau des Prophètes.',
    NULL
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO lms_quizzes (id, product_id, module_id, title, passing_score, max_attempts) VALUES
  ('quiz-risala-1', 'demo-cours-risala', 'mod-risala-1', 'Quiz : Introduction à la Risala', 70, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO lms_quiz_questions (id, quiz_id, question, options, correct_answer, position) VALUES
  ('qz-r1-1', 'quiz-risala-1', 'De quelle ville était originaire Ibn Abi Zayd al-Qayrawani ?',
   '["Fès", "Kairouan", "Cordoue", "Bagdad"]'::jsonb, 1, 1),
  ('qz-r1-2', 'quiz-risala-1', 'Pourquoi Ibn Abi Zayd est-il surnommé « le Petit Malik » ?',
   '["Il était de petite taille", "Pour sa profonde maîtrise du madhab maliki", "Il était l''élève direct de Malik", "Il vivait après Malik de peu d''années"]'::jsonb, 1, 2),
  ('qz-r1-3', 'quiz-risala-1', 'Combien d''attributs obligatoires d''Allah sont traditionnellement énumérés ?',
   '["7", "10", "13", "20"]'::jsonb, 2, 3),
  ('qz-r1-4', 'quiz-risala-1', 'Quel ange est chargé d''apporter la révélation divine ?',
   '["Mikail", "Israfil", "Jibril (Gabriel)", "''Azra''il"]'::jsonb, 2, 4)
ON CONFLICT (id) DO NOTHING;


-- ── Cours 3 : Cursus de Sciences Islamiques (Tronc Commun) ───────

INSERT INTO ecom_products (id, name, handle, description, price, compare_at_price, product_type, status, images, tags, metadata)
VALUES (
  'demo-cours-sciences-islamiques',
  'Cursus de Sciences Islamiques — Tronc Commun',
  'cursus-sciences-islamiques',
  'Un programme structuré pour acquérir des bases solides et progresser méthodiquement dans les sciences islamiques. Minimum 110 heures de formation dispensées par Ustadh Sayf. Cours en direct et en replay, 2 séances par semaine, 4 heures de formation hebdomadaire.',
  19900,
  24900,
  'Cours',
  'active',
  ARRAY['https://images.unsplash.com/photo-1585468274952-66591eb14165?w=800'],
  ARRAY['avance', 'sciences-islamiques', 'maliki'],
  '{"instructor": "Ustadh Sayf", "level": "Intermédiaire", "duration": "110h minimum", "lessons_count": 5, "access_days": 365, "sessions_per_week": 2, "hours_per_week": 4, "live_and_replay": true}'
) ON CONFLICT (handle) DO NOTHING;

INSERT INTO lms_modules (id, product_id, title, position, sequential_unlock) VALUES
  ('mod-si-1', 'demo-cours-sciences-islamiques', 'Commentaire de Mayyara — Ibn ''Ashir (Aqida, Fiqh & Tasawwuf)', 1, true),
  ('mod-si-2', 'demo-cours-sciences-islamiques', 'Éthique de l''Étudiant — Imam al-Nawawi', 2, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO lms_lessons (id, module_id, title, position, duration_minutes, is_free_preview,
  video_url, content, attachments) VALUES
  (
    'lez-si-1-1',
    'mod-si-1',
    'Introduction au cursus — Programme de 110 heures avec Ustadh Sayf',
    1, 30, true,
    NULL,
    E'Bienvenue dans le Cursus de Sciences Islamiques dispensé par Ustadh Sayf.\n\n📋 Programme complet — Minimum 110 heures\n\n① Commentaire de Mayyara / Ibn ''Ashir ............. 40H\nÉpître traditionnelle sur les savoirs de base : croyances, adorations et spiritualité.\n\n② Éthique de l''étudiant (al-Nawawi) ............... 30H\nIssu de l''introduction du Majmu'' de l''Imam al-Nawawi.\n\n③ Commentaire d''al-Waraqât (al-Haṭṭâb) .......... 20H\nFondements de la jurisprudence islamique (Usul al-Fiqh).\n\n④ Commentaire de Nourbat al-Fikar (Ibn Hajar) .... 14H\nTerminologie du hadith (Mustalah al-Hadith).\n\n⑤ Commentaire des fondements de l''école malikite . 6H\n(نظم ابن أبي كف)\n\n📅 Organisation\n— 2 séances/semaine × 4h hebdomadaires\n— Cours en direct + replay illimité\n— Sessions questions/réponses incluses\n— Attestation de réussite en fin de cursus',
    '[{"label": "Programme détaillé du cursus 110H (PDF)", "url": "#"}]'::jsonb
  ),
  (
    'lez-si-1-2',
    'mod-si-1',
    'Les croyances fondamentales selon Ibn ''Ashir',
    2, 45, false,
    NULL,
    E'Étude du texte d''Ibn ''Ashir — Pilier 1 : L''Aqida\n\n📚 Le Matn d''Ibn ''Ashir (المرشد المعين)\nComposé par Abdelwahid ibn Ashir Al-Andalusi (m. 1040 H), ce texte rassemble en vers les trois piliers :\n• Aqida (Ash''ariyya)\n• Fiqh (Malikiyya)\n• Tasawwuf (voie de Junayd)\n\n🔹 Les 7 attributs obligatoires d''Allah\n① الوجود — L''Existence nécessaire\n② القدم — La Pré-éternité (sans commencement)\n③ البقاء — La Post-éternité (sans fin)\n④ المخالفة للحوادث — La différence avec les créatures\n⑤ القيام بالنفس — L''auto-subsistance\n⑥ الوحدانية — L''Unicité absolue\n⑦ الحياة — La Vie\n\nPlus les attributs : القدرة ، الإرادة ، العلم ، السمع ، البصر ، الكلام',
    '[{"label": "Fiche : Les attributs selon Ibn ''Ashir", "url": "#"}]'::jsonb
  ),
  (
    'lez-si-1-3',
    'mod-si-1',
    'Les adorations (Fiqh Maliki) — La Pureté rituelle',
    3, 50, false,
    NULL,
    E'Ibn ''Ashir — Pilier 2 : Les adorations selon le Fiqh Maliki\n\n🕌 La Pureté Rituelle (الطهارة)\n\n📌 Fardh du Wudu selon l''école Maliki :\n① النية — L''intention\n② غسل الوجه — Laver le visage\n③ غسل اليدين — Laver les bras jusqu''aux coudes\n④ مسح الرأس كاملاً — Frotter la totalité de la tête\n⑤ غسل الرجلين — Laver les pieds jusqu''aux chevilles\n⑥ الترتيب — Respecter l''ordre\n⑦ الموالاة — La continuité (sans interruption)\n\n📌 Ce qui invalide le Wudu\n• Tout ce qui sort des deux orifices naturels\n• Le sommeil profond\n• Le toucher de la peau d''une femme avec désir (selon l''avis maliki)\n• La perte de connaissance',
    '[{"label": "Tableau récapitulatif du Wudu maliki (PDF)", "url": "#"}]'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO lms_lessons (id, module_id, title, position, duration_minutes, is_free_preview,
  video_url, content, attachments) VALUES
  (
    'lez-si-2-1',
    'mod-si-2',
    'L''intention dans la quête du savoir — al-Nawawi',
    1, 35, false,
    NULL,
    E'Étude de l''Éthique de l''étudiant (آداب طالب العلم) — al-Nawawi\n\n« Que celui qui recherche le savoir l''acquière pour l''amour d''Allah, pour agir selon lui, pour raviver la Sunna, pour illuminer son cœur. » — Al-Nawawi\n\n📌 Les conditions de l''étudiant sérieux\n① Purifier son intention (إخلاص النية)\n② Corriger ses adorations avant d''enseigner\n③ Se consacrer pleinement à l''étude\n④ Éviter les occupations superflues\n⑤ Respecter le maître et ses condisciples\n\n⚠️ Les pièges à éviter\n• Étudier pour la gloire (الرياء)\n• Étudier sans mettre en pratique\n• Négliger les œuvres pieuses',
    '[{"label": "Texte original d''al-Nawawi (arabe)", "url": "#"}]'::jsonb
  ),
  (
    'lez-si-2-2',
    'mod-si-2',
    'Les droits du maître et la discipline du savoir',
    2, 40, false,
    NULL,
    E'Suite — Éthique de l''étudiant selon al-Nawawi\n\n👨‍🏫 Les droits du Maître (حقوق الشيخ)\n① Le respecter en présence et en absence\n② Ne pas s''asseoir à sa place\n③ Parler avec retenue, ne pas l''interrompre\n④ Ne pas le désigner par son prénom\n⑤ Transmettre fidèlement son enseignement\n\n📖 La discipline dans l''étude\n• Commencer par les textes fondateurs (المتون)\n• Ne pas s''éparpiller avant de maîtriser les bases\n• Répéter et réviser régulièrement\n• Consigner ses notes avec soin\n\n🤲 Du''a de l''étudiant\n« اللهم انفعني بما علمتني وعلمني ما ينفعني وزدني علما »',
    NULL
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO lms_quizzes (id, product_id, module_id, title, passing_score, max_attempts) VALUES
  ('quiz-si-1', 'demo-cours-sciences-islamiques', 'mod-si-1', 'Quiz : Ibn ''Ashir — Aqida & Adorations', 70, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO lms_quiz_questions (id, quiz_id, question, options, correct_answer, position) VALUES
  ('qz-si1-1', 'quiz-si-1', 'Combien d''heures minimum compte le Cursus de Sciences Islamiques d''Ustadh Sayf ?',
   '["50 heures", "80 heures", "100 heures", "110 heures"]'::jsonb, 3, 1),
  ('qz-si1-2', 'quiz-si-1', 'Le texte d''Ibn ''Ashir couvre combien de domaines fondamentaux ?',
   '["1 (Aqida)", "2 (Aqida + Fiqh)", "3 (Aqida + Fiqh + Tasawwuf)", "4"]'::jsonb, 2, 2),
  ('qz-si1-3', 'quiz-si-1', 'Quel madhab est suivi dans le texte d''Ibn ''Ashir pour le Fiqh ?',
   '["Hanafi", "Shafi''i", "Maliki", "Hanbali"]'::jsonb, 2, 3),
  ('qz-si1-4', 'quiz-si-1', 'Que signifie القدم parmi les attributs obligatoires d''Allah ?',
   '["La Toute-Puissance", "La Pré-éternité sans commencement", "La Perpétuité", "L''Unicité"]'::jsonb, 1, 4)
ON CONFLICT (id) DO NOTHING;


-- ── Cours 4 : Introduction à la Langue Arabe ─────────────────────

INSERT INTO ecom_products (id, name, handle, description, price, compare_at_price, product_type, status, images, tags, metadata)
VALUES (
  'demo-cours-arabe',
  'Introduction à la Langue Arabe',
  'introduction-langue-arabe',
  'Apprenez les bases de la langue arabe : alphabet, grammaire fondamentale et vocabulaire courant. Cours conçu pour les débutants souhaitant acquérir des bases solides en vue d''étudier les sciences islamiques.',
  4900,
  6900,
  'Cours',
  'active',
  ARRAY['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800'],
  ARRAY['debutant', 'arabe'],
  '{"instructor": "Ustadh Sayf", "level": "Débutant", "duration": "8h de contenu", "lessons_count": 4, "access_days": 365}'
) ON CONFLICT (handle) DO NOTHING;

INSERT INTO lms_modules (id, product_id, title, position, sequential_unlock) VALUES
  ('mod-arabe-1', 'demo-cours-arabe', 'L''Alphabet Arabe', 1, true),
  ('mod-arabe-2', 'demo-cours-arabe', 'Les Bases de la Grammaire', 2, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO lms_lessons (id, module_id, title, position, duration_minutes, is_free_preview,
  video_url, content, attachments) VALUES
  (
    'lez-arabe-1-1',
    'mod-arabe-1',
    'Les 28 lettres de l''alphabet arabe',
    1, 20, true,
    NULL,
    E'Dans cette leçon, nous découvrons les 28 lettres de l''alphabet arabe.\n\nChaque lettre possède jusqu''à 4 formes selon sa position dans le mot :\n• Forme isolée\n• Forme initiale (début du mot)\n• Forme médiane (milieu du mot)\n• Forme finale (fin du mot)\n\nPoints clés :\n— L''arabe s''écrit et se lit de droite à gauche\n— Les voyelles courtes (harakat) sont souvent omises dans les textes courants\n— Les lettres solaires et lunaires influencent la prononciation de l''article ال\n\n📌 Pourquoi apprendre l''arabe ?\nL''Imam al-Shafi''i disait : « Apprenez l''arabe, car il fortifie l''intelligence et accroît la noblesse. »',
    '[{"label": "Tableau de l''alphabet arabe (PDF)", "url": "#"}]'::jsonb
  ),
  (
    'lez-arabe-1-2',
    'mod-arabe-1',
    'Connexion des lettres — Écriture cursive',
    2, 25, false,
    NULL,
    E'La langue arabe est une écriture cursive : la plupart des lettres se connectent entre elles.\n\n✎ Lettres qui se connectent des deux côtés : ب ت ث ن ي ق ف\n✎ Lettres qui ne se connectent qu''à gauche : ا د ذ ر ز و\n\nExercice 1 — كتاب (kitaab = livre) :\nك + ت + ا + ب = كتاب\n\nExercice 2 — مدرسة (madrasa = école) :\nم + د + ر + س + ة = مدرسة',
    NULL
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO lms_lessons (id, module_id, title, position, duration_minutes, is_free_preview,
  video_url, content, attachments) VALUES
  (
    'lez-arabe-2-1',
    'mod-arabe-2',
    'Le Nom (الاسم) — Masculin, Féminin et Nombre',
    1, 30, false,
    NULL,
    E'En arabe, les noms ont un genre (masculin/féminin) et un nombre (singulier/duel/pluriel).\n\n📌 Féminin : ة (ta marbouta)\nطالب → طالبة\n\n📌 Duel : ان / ين\nكتاب → كتابان (deux livres, nominatif)\n\n📌 Pluriel régulier et brisé\nمسلم → مسلمون (régulier)\nكتاب → كتب (brisé)',
    '[{"label": "Fiche de grammaire — Le Nom (PDF)", "url": "#"}]'::jsonb
  ),
  (
    'lez-arabe-2-2',
    'mod-arabe-2',
    'Le Verbe (الفعل) — Racines triconsonantiques',
    2, 35, false,
    NULL,
    E'Le verbe arabe repose sur une racine triconsonantique (الجذر).\n\n🔑 Racine ك-ت-ب (écrire)\n• كَتَبَ = il a écrit\n• يَكْتُبُ = il écrit\n• كَتَبَتْ = elle a écrit\n\n🔑 Racine ع-ل-م (savoir)\n• عَلِمَ = il a su\n• يَعْلَمُ = il sait\n• عَلَّمَ (forme II) = il a enseigné',
    NULL
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO lms_quizzes (id, product_id, module_id, title, passing_score, max_attempts) VALUES
  ('quiz-arabe-1', 'demo-cours-arabe', 'mod-arabe-1', 'Quiz : L''Alphabet Arabe', 70, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO lms_quiz_questions (id, quiz_id, question, options, correct_answer, position) VALUES
  ('qz-a1-1', 'quiz-arabe-1', 'Combien de lettres compte l''alphabet arabe ?',
   '["24", "26", "28", "30"]'::jsonb, 2, 1),
  ('qz-a1-2', 'quiz-arabe-1', 'Dans quel sens s''écrit l''arabe ?',
   '["De gauche à droite", "De droite à gauche", "De haut en bas", "De bas en haut"]'::jsonb, 1, 2),
  ('qz-a1-3', 'quiz-arabe-1', 'Quel signe représente le féminin en arabe ?',
   '["الألف الممدودة", "تاء مربوطة (ة)", "الواو", "الياء"]'::jsonb, 1, 3),
  ('qz-a1-4', 'quiz-arabe-1', 'Combien de formes peut prendre une lettre arabe ?',
   '["1", "2", "3", "4"]'::jsonb, 3, 4)
ON CONFLICT (id) DO NOTHING;


-- ── Coupons de démonstration ──────────────────────────────────────
INSERT INTO ecom_coupons (code, percent_off, active) VALUES
  ('DEMO20', 20, true),
  ('BIENVENUE10', 10, true),
  ('SAYF2026', 15, true)
ON CONFLICT (code) DO NOTHING;
