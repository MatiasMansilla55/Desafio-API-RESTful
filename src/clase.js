const { promises: fs } = require("fs");

class Contenedor {
  constructor(ruta) {
    this.ruta = ruta;
  }
  async save(nuevoObjeto) {
    //Obtner todos los datos que ya existe en el archivo

    const objetos = await this.getAll();

    //hacer la logica para obtener el nuevo id
    let newId;
    if (objetos.length == 0) {
      newId = 1;
    } else {
      const ultimoId = parseInt(objetos[objetos.length - 1].id);
      newId = ultimoId + 1;
    }
    //agregar el nuevo objeto al array que existe en el archivo
    objetos.push({ ...nuevoObjeto, id: newId });
    //guardar el nuvevo array con el nuevo agregado
    try {
      await fs.writeFile(this.ruta, JSON.stringify(objetos, null, 2));
      return newId;
    } catch (error) {
      console.log(`Error al guardar: ${error}`);
    }
  }
  // async getById(id) {
  //   try {
  //     const content = await this.getAll();

  //      const item= content.find((item) => item.id === id);
      // if (item.length == 0) {
      //   return null;
      // }
      // return item
      // return JSON.stringify(item);
      
  //   } catch (err) {
  //     console.log(`${err}`);
  //   }
  // }
  async getById(id) {
    id = Number(id);
    try {
      const data = await this.getAll();
      // const parsedData = JSON.parse(data);

      return data.find((producto) => producto.id === id);
    } catch (err) {
      console.log(
        `Error Code: ${err.code} | There was an error when trying to get an element by its ID (${id})`
      );
    }
  }

  async getAll() {
    try {
      const objetos = await fs.readFile(this.ruta, "utf-8");
      return JSON.parse(objetos);
    } catch (error) {
      console.log(`Error al leer archivo:${error}`);
    }
  }
  async deleteById(id) {
    //obtener todos los datos que ya existen en el archivo
    const objetos = await this.getAll();
    //filtrar todos los datos para identificar el objeto a eliminar y eliminarlo
    const nuevoObjeto = objetos.filter((elemento) => elemento.id !== id);
    if (nuevoObjeto.length === objetos.length) {
      console.log(`Error al borrar:no se encontro el id:${id}`);
    }
    try {
      await fs.writeFile(this.ruta, JSON.stringify(nuevoObjeto, null, 2));
    } catch (error) {
      console.log(`Error al borrar:no se encontro el error:${error}`);
    }
  }
  //nueva funcion que permite reemplazar los datos por id.
  async updateById(id, newData) {
    try {
      id = Number(id);
      const data = await this.getData();
      const parsedData = JSON.parse(data);
      const objectIdToBeUpdated = parsedData.find(
        (producto) => producto.id === id
      );
      if (objectIdToBeUpdated) {
        const index = parsedData.indexOf(objectIdToBeUpdated);
        const { title, price, thumbnail } = newData;

        parsedData[index]["title"] = title;
        parsedData[index]["price"] = price;
        parsedData[index]["thumbnail"] = thumbnail;
        await fs.writeFile(this.ruta, JSON.stringify(parsedData));
        return true;
      } else {
        console.log(`ID ${id} does not exist in the file`);
        return null;
      }
    } catch (err) {
      `Error Code: ${err.code} | There was an error when trying to update an element by its ID (${id})`;
    }
  }
  async deleteAll() {
    try {
      const content = [];
      fs.writeFile(this.ruta, JSON.stringify(content, null, 2));
    } catch (err) {
      console.log(`${err}`);
    }
  }
}

const listaProductos = new Contenedor("./productos.txt");

//Metodos:
// listaProductos.save({ title: "Acondicionador", price: "12usd" });
// listaProductos.deleteById(1);
// listaProductos.getById(2);

// listaProductos.deleteAll();

module.exports = Contenedor;
