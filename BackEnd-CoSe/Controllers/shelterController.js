const Shelter = require("../Models/shelterModel");
const { jsonType } = require("../Utils/headerTypes");

async function getShelters(req, res) {
    try {
        const shelters = await Shelter.findAll();

        console.log("Shelters: ", shelters);
        res.writeHead(200, jsonType);
        res.end(shelters);

    } catch (error) {
        console.log("Error: ", error);
        res.writeHead(404, jsonType);
        res.end(JSON.stringify({ message: "No shelters found" }));
    }
}

async function insertShelter(shelter, req, res) {
    try {
        await Shelter.insert(shelter);

        console.log("Shelter created succesfully");
        console.log("Shelter: ", shelter);

        res.writeHead(201, jsonType);
        res.end(JSON.stringify(shelter));
    } catch (error) {
        console.log("Error: ", error);

        res.writeHead(400, jsonType);
        res.end(JSON.stringify({ message: "Error in creating shelter" }));
    }
}

async function deleteShelter(id, req, res) {
    try {
        const shelter = await Shelter.findById(id);

        if (shelter) {
            await Shelter.remove(id);

            console.log(`Shelter with id ${id} deleted`);

            res.writeHead(200, jsonType);
            res.end(JSON.stringify({ message: "Shelter has been deleted" }));
        }
    } catch (error) {
        console.log("Error: ", error);

        res.writeHead(404, jsonType);
        res.end(JSON.stringify({ message: "Shelter not found" }));
    }
}

async function updateShelter(updatedShelter, req, res) {
    try {
        const shelter = await Shelter.findById(shelter.id);

        await Shelter.update(updatedShelter);

        console.log(`Shelter with id ${shelter.id} updated`);

        res.writeHead(200, jsonType);
        res.end(JSON.stringify({ message: "Shelter has been updated" }));
    } catch (error) {
        console.log("Error: ", error);

        res.writeHead(404, jsonType);
        res.end(JSON.stringify({ message: "Shelter not found" }));
    }
}

module.exports = {
    getShelters,
    insertShelter,
    deleteShelter,
    updateShelter,
};
