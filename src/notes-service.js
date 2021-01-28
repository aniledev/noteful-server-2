// create a service to get all notes using knex
const notesService = {
  getAllNotes(knex) {
    return knex.select("*").from("notes");
  },
  // insert a single note using knex
  insertNotes(knex, newNote) {
    return knex
      .insert(newNote)
      .into("notes")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  // get a single note by its id
  getNoteById(knex, id) {
    return knex.from("notes").where("noteId", id).first();
  },
  // delete a note by its id
  deleteNote(knex, id) {
    return knex("notes").where("noteId", id).delete();
  },
  // update a singular note
  updateNote(knex, id, updatedNote) {
    return knex("notes").where("noteId", id).update(updatedNote);
  },
};

module.exports = notesService;
