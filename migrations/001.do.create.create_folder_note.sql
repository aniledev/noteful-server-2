CREATE TABLE folders(
    folderId INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    folderName TEXT NOT NULL
);

CREATE TABLE notes(
    noteId INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    noteName TEXT NOT NULL,
    modified TIMESTAMPTZ DEFAULT now(),
    folderId INTEGER REFERENCES folders(folderId) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL
);