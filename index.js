const express = require("express");
const app = express();
const { v4: uuid4 } = require("uuid");
app.use(express.json());

const cities = [
  {
    id: "5347da70-fef3-4e8f-ba49-e8010edba878",
    name: "Stockholm",
    population: 1372565,
  },
  {
    id: "4787e794-b3ac-4a63-bba0-03203f78e553",
    name: "Göteborg",
    population: 549839,
  },
  {
    id: "4bc43d96-3e84-4695-b777-365dbed33f89",
    name: "Malmö",
    population: 280415,
  },
  {
    id: "ec6b9039-9afb-4632-81aa-ff95338a011a",
    name: "Uppsala",
    population: 140454,
  },
  {
    id: "6f9eee1f-b582-4c84-95df-393e443a2cae",
    name: "Västerås",
    population: 110877,
  },
  {
    id: "27acb7a0-2b3d-441f-a556-bec0e430992a",
    name: "Örebro",
    population: 107038,
  },
  {
    id: "6745e3f4-636a-4ab7-8626-2311120c92c9",
    name: "Linköping",
    population: 104232,
  },
  {
    id: "a8a70019-9382-4215-a5b3-6278eb9232c3",
    name: "Helsingborg",
    population: 97122,
  },
  {
    id: "6fc1a491-3710-42f2-936d-e9bf9be4f915",
    name: "Jönköping",
    population: 89396,
  },
  {
    id: "45428195-ab40-43d2-ad11-a62933f4a3a8",
    name: "Norrköping",
    population: 87247,
  },
];

// Vanlig GET
app.get("/", (req, res) => {
  let stadFilter = cities;
  if (req.query.name) {
    stadFilter = stadFilter.filter((city) => {
      return city.name.toLowerCase().includes(req.query.name.toLowerCase());
    });
  }
  if (req.query.minPopulation) {
    stadFilter = stadFilter.filter((city) => {
      return city.population >= req.query.minPopulation;
    });
  }
  if (req.query.maxPopulation) {
    stadFilter = stadFilter.filter((city) => {
      return city.population <= req.query.maxPopulation;
    });
  }
  res.json(stadFilter);
});

// GLöm inte, params.id försöker matcha (dvs url id/texten) id till städerna i objekten ovan.
// Då hämtar den det datan annars skickar den felkod(404)
app.get("/:id", (req, res) => {
  const city = cities.find((city) => city.id === req.params.id);
  if (!city) {
    res.status(404).send("Hittar ej stad");
  } else {
    res.json(city);
  }
});

// ------------- Delete
app.delete("/:id", (req, res) => {
  const StadIndex = cities.findIndex((city) => city.id === req.params.id);
  if (StadIndex === -1) {
    res.status(404).send("Hittar ej stad");
  } else {
    cities.splice(StadIndex, 1);
    res.sendStatus(200);
  }
});

// ---------------- POST
app.post("/", (req, res) => {
  const name = req.body.name;
  const population = req.body.population;

  // Kolla namn och population
  if (!name || !population) {
    res.status(400).send("Namn och befolkning?");
    return;
  }

  // Kolla så inget annat än name och population finns med
  if (
    Object.keys(req.body).some((key) => key !== "name" && key !== "population")
  ) {
    res.status(400).send("skriv endast stad och population");
    return;
  }

  // Kolla att name är string och inte tom
  if (typeof name !== "string" || name.trim().length === 0) {
    res.status(400).send("Bara text och ej tomt");
    return;
  }

  // Kolla att det inte finns en annan stad med samma namn
  if (cities.some((city) => city.name === name)) {
    res.status(409).send("Staden finns redan");
    return;
  }

  // Kolla så att det är heltal
  if (!Number.isInteger(population) || population < 0) {
    res.status(400).send("Använd ej decimaler");
    return;
  }

  const id = uuid4();
  const newCity = {
    id: id,
    name: name,
    population: population,
  };
  cities.push(newCity);
  res.status(201).send("Ny stad har lagts till");
});

// ------------- PUT
app.put("/:id", (req, res) => {
  const city = cities.find((city) => city.id === req.params.id);

  if (!city) {
    res.status(404).send("Hittar ej stad");
    return;
  }

  const id = req.body.id;
  const name = req.body.name;
  const population = req.body.population;

   // Kolla namn och population
  if (!id || !name || !population) {
    res.status(400).send("ID, namn och befolkning krävs");
    return;
  }

  // Kolla så inget annat än id, name och population finns med
  if (
    Object.keys(req.body).some(
      (key) => key !== "id" && key !== "name" && key !== "population"
    )
  ) {
    res.status(400).send("Endast stad, id och population");
    return;
  }

  // Kolla att name är unikt
  if (cities.some((a) => a.name === name && a.id !== city.id)) {
    res.status(409).send("Staden finns redan");
    return;
  }

  // Kolla att name är string och inte tom
  if (typeof name !== "string" || name.trim().length === 0) {
    res.status(400).send("Namn måste vara text");
    return;
  }

  // Kolla att population är ett icke-negativt heltal
  if (!Number.isInteger(population) || population < 0) {
    res.status(400).send("Population måste vara ett heltal");
    return;
  }

  // Kolla att ID i adressen matchar ID i bodyn
  if (id !== req.params.id) {
    res.status(400).send("ID i adressen matchar inte ID i bodyn");
    return;
  }

  // Uppdatera staden
  city.name = name;
  city.population = population;

  res.status(200).send("Stad uppdaterad");
});

app.listen(8080, () => {
  console.log("Server startad på port 8080");
});