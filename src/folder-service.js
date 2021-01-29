// create method to get all folders using knex
const foldersService = {
  getAllFolders(knex) {
    return knex.select("*").from("folders");
  },
  // create method to insert a folder using knex
  insertFolder(knex, newFolder) {
    return knex
      .insert(newFolder)
      .into("folders")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  // create method to get a specific folder
  getFolderById(knex, id) {
    return knex("folders").where("folderid", id).first();
  },
  // create method to delete a folder
  deleteFolder(knex, id) {
    return knex("folders").where("folderid", id).delete();
  },
  // create method to update a folder
  updateFolder(knex, id, updatedFolder) {
    return knex("folders").where("folderid", id).update(updatedFolder);
  },
};

module.exports = foldersService;
