const url =
  "https://nominatim.openstreetmap.org/search?q=Av.+18+de+Julio+1046,+Montevideo&format=json";


let lat, lon;

fetch(url)
  .then((response) => {    
    if (!response.ok) {
      throw new Error("Ocurrió un error al obtener la respuesta.");
    }   
    return response.json();
  })
  .then((data) => {    
    if (data.length > 0) {
      const firstResult = data[0];     
      console.log("Latitud:", firstResult.lat);
      console.log("Longitud:", firstResult.lon);
      lat = firstResult.lat;
      lon = firstResult.lon;      
      createMap(lat, lon);
    } else {
      console.log(
        "No se encontraron resultados para la dirección proporcionada."
      );
    }
  })
  .catch((error) => {    
    console.error("Ocurrió un error:", error);
  });


function createMap(lat, lon) {
  let map = L.map("mi_mapa").setView([lat, lon], 18);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.marker([lat, lon]).addTo(map)
      .bindPopup('Ubicación encontrada.')
      .openPopup();
}
