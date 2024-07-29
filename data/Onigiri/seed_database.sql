-- Active: 1690793481131@@127.0.0.1@5432@okanban@public
INSERT INTO list("title") VALUES ('Start');
INSERT INTO list("title") VALUES ('Process');
INSERT INTO list("title") VALUES ('Done');


INSERT INTO card("content", "color", "list_id") VALUES ('Integration', '#FF00FF', 1);
INSERT INTO card("content", "color", "list_id") VALUES ('Base de données', '#FF00FF', 2);
INSERT INTO card("content", "color", "list_id") VALUES ('Serveur', '#FF00FF', 3);

INSERT INTO tag("title", "color") VALUES ('Urgent', 'red');
INSERT INTO tag("title", "color") VALUES ('Retard', 'blue');

INSERT INTO card_has_tag("card_id", "tag_id") VALUES (2, 1);

INSERT INTO card_has_tag("card_id", "tag_id") VALUES (3, 2);