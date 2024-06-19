export function getByProv(){
    return fetch(`https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre`)  
    .then((res)  => res.json())
}

export function getByMun(id){
    return fetch(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${id}&campos=id,nombre&max=100`)  
    .then((res)  => res.json())
}