class Wrapper {
  constructor() {
    const readline = require("readline");
    const io = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    io.question("Filename: ", filename => {
      io.question(
        "Type of separator (type 'space' or 'comma'): ",
        separator => {
          this.separator = separator == "space" ? " " : ",";
          console.time("Done in: ");
          new TextToJSON(filename,this.separator);
          console.timeEnd("Done in: ");
          io.close();
        }
      );
    });
  }
}
class TextToJSON {
  constructor(filename,separator) {
    this.fs = require("fs");
    this.path = require("path");
    const file = [];
    this.fs
      .readFileSync(this.path.join(__dirname, filename), "utf8")
      .split("\r\n")
      .forEach(element => {
        file.push(element.split(separator));
      });
    const header = file.shift();
    this.prepareJSON(file, header);
  }

  prepareJSON(data, header) {
    const result = [];
    let object = {};
    data.forEach(row => {
      row.forEach((element, index) => {
        object[header[index]] = element;
      });
      result.push(object);
      object = {};
    });
    this.saveToFile(result);
  }

  saveToFile(jsonArray) {
    jsonArray.forEach(object => {
      this.fs.writeFileSync(
        "output.json",
        JSON.stringify({ jsonArray }, {}, 1),
        err => {
          if (err) throw err;
        }
      );
    });
  }
}

new Wrapper();
