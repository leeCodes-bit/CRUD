import http, { IncomingMessage, Server, ServerResponse } from "http";
const fs = require('fs');
const url = require('url');

const port:number = 3005;
interface DataInfo {
  organization: string,
  createdAt: string,
  updatedAt: string,
  products: [string],
  marketValue: string,
  address: string,
  ceo: string,
  country:string,
  id: number, 
  noOfEmployees:number,
  employees:[string]
}
const database : [DataInfo]= JSON.parse(fs.readFileSync('./server/data.json'))

const server: Server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = url.parse(req.url);
    const path : string = parsedUrl.pathname;
   const id: number = Number(path.split("/")[2])
 
   if (path === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('Welcome to databases');
    res.end();
  }
  else if (path === '/database') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(database));
      res.end();
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        const {
          organization,
          createdAt,
          updatedAt,
          products,
          marketValue,
          address,
          ceo,
          country,
          noOfEmployees,
          employees,
        } = JSON.parse(body);
        const newData = {
          organization,
          createdAt,
          updatedAt,
          products,
          marketValue,
          address,
          ceo,
          country,
          id: database.length + 1,
          noOfEmployees,
          employees,
        };
        newData.noOfEmployees = newData.employees.length
        newData.createdAt = new Date().toISOString()
        newData.updatedAt = new Date().toISOString()
        database.push(newData);
        fs.writeFileSync('./server/data.json', JSON.stringify(database, null, 2) + '\n');
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(newData));
        res.end();
      });
    }
  } else if (path === '/database/' + id) {
    const data = database.find((element) => element.id === id);
    if (!data) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('The record with the given ID was not found.');
      res.end();
    } else {
      if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(data));
        res.end();
      } else if (req.method === 'PUT') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          const {
            organization,
            createdAt,
            updatedAt,
            products,
            marketValue,
            address,
            ceo,
            country,
            noOfEmployees,
            employees,
          } = JSON.parse(body);
          const data = database.find((element) => element.id === id);
          if (!data) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write('The record with the given ID was not found.');
            res.end();
          } else {
            const updatedData = {
              organization: organization || data.organization,
              createdAt: createdAt || data.createdAt,
              updatedAt: updatedAt || data.updatedAt,
              products: products || data.products,
              marketValue: marketValue || data.marketValue,
              address: address || data.address,
              ceo: ceo || data.ceo,
              country: country || data.country,
              id: id,
              noOfEmployees: noOfEmployees || data.noOfEmployees,
              employees: employees || data.employees,
            };
            updatedData.noOfEmployees = updatedData.employees.length
            updatedData.createdAt = new Date().toISOString()
            updatedData.updatedAt = new Date().toISOString()
            const index = database.indexOf(data);
            database[index] = updatedData;
            fs.writeFileSync('./server/data.json', JSON.stringify(database, null, 2) + '\n');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(updatedData));
            res.end();
          }
        });
      }
      else if (req.method === 'DELETE') {
        const data = database.find((element) => element.id === id);
        if (!data) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.write('The record with the given ID was not found.');
          res.end();
        } else {
          const index = database.indexOf(data);
          database.splice(index, 1);
          fs.writeFile('./server/data.json', JSON.stringify(database, null, 2) + '\n', (err:string) => {
            if (err) throw err;
          });
          res.writeHead(200, { 'Content-Type': 'text/plain'  });
          res.write(JSON.stringify('File deleted!!!'));
          res.end();
        }
      }
    }}else{
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('The record with the given ID was not found.');
      res.end();
    }
})
server.listen(port, () => {
  console.log(`listening on port ${port}`);
})

// bugs- validation
//repetitive data, use organisation for my checks
//products should only reveive an array
//no of employees has a but
// check for the id of the last item in the array and then add 1 to get the unique id