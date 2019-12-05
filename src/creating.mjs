import setText, { appendText } from "./results.mjs";

export function timeout() {
  //1. create the promise which is an object.

  //const wait = new Promise();

  //At this moment the promise is in pending state. Now is time to start make it changing of statesuntil get the fulfilled state...
  //The promise object take one function as THE ONLY paramater to its constructor and is known as the EXECUTOR FUNCTION
  //2. pass the executor function which takes the resolve parameter which is a function used to call the then() function and  to set the fulfilled state
  const wait = new Promise(function executorFunction(resolve) {
    //function to be transformed in a promise. Promises are eager so this function is automatically inmediatelly invoqued => No need to invoque the fucntion.
    setTimeout(function functionPromisefied() {
      //call once the promesified function
      resolve(`the executor function calls the resolve method of the promise object 
                which set the state of the promise from pending to fulfilled 
                also, this resolve method, call the then() method on the promise and 
                return this vaule. In this case is a string but can be anything.`);
    }, 1500);
  });

  //Managing the fulfilled state
  wait.then(text => setText(text));
}

export function interval() {
  let counterPromisefiedFunctionCallings = 0;
  const wait = new Promise(function executorFunction(resolve) {
    //call several times the promesified function

    setInterval(function functionPromisefied() {
      console.log("called!");
      resolve(`${++counterPromisefiedFunctionCallings} Remember that: the executor 
                    function calls the resolve method of the promise object 
                    which set the state of the promise from pending to fulfilled 
                    also, this resolve method, call the then() method on the promise and 
                    return this vaule. In this case is a string but can be anything.`);
    }, 1500);
  })
    //Testing the code we can see that the text is never updated after each interval. so we can add a finally() fucntion...
    //Managing the fulfilled state
    .then(text => setText(text))
    .finally(() =>
      appendText(`--Done!-- ${counterPromisefiedFunctionCallings}`)
    );

  //Stills no update because ONCE THE PROMISE IS RESOLVED (TO SUCCES/ANOTHER PROMISE OR REJECT) THE METHOD resolve() does nothing.
  //That means once the promise is settled or resolved its done, the state wont change anymore. Doesn't matter if the promisied function is called many times
}

export function clearIntervalChain() {
  let counterPromisefiedFunctionCallings = 0;
  let intervalID;
  const wait = new Promise(function executorFunction(resolve) {
    intervalID = setInterval(function functionPromisefied() {
      console.log("called!");
      resolve(`${++counterPromisefiedFunctionCallings} Remember that: the executor 
                    function calls the resolve method of the promise object 
                    which set the state of the promise from pending to fulfilled 
                    also, this resolve method, call the then() method on the promise and 
                    return this vaule. In this case is a string but can be anything.`);
    }, 1500);
  })
    .then(text => setText(text))
    .finally(() => {
      clearInterval(intervalID);
    });
}
//the executor function also takes the reject parameter which is a function used to call the then() function and  to set the rejected state
export function xhr() {
  let request = new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/users/7");
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      }
      //XHR request only triger an error event when the error is a 500, but a 400 is a reject too so we need to move the promise to the reject satus also in 400 errors.
      else {
        reject(xhr.statusText);
      }
    };
    xhr.onerror = () => {
      reject("Reques failed!");
    };
    xhr.send();
  });
  request.then(result => setText(result)).catch(reason => setText(reason));
} //AS conclusion: YOU HAVE THE POWER TO DEFINE WHEN THE PROMISE IS FULFILLED OR REJECTED

export function allPromises() {
  let categories = axios.get("http://localhost:3000/itemCategories");
  let statuses = axios.get("http://localhost:3000/orderStatuses");
  let userTypes = axios.get("http://localhost:3000/userTypes");
  //What happens if one promise fails??
  let addressTypes = axios.get("http://localhost:3000/addressTypes");
  //Promise.all will wait until ALL PROMISES ARE FULFILLED OR ONE IS REJECTED

  //How to execute all the request and wait to have all te responses before execute another function??? use Promises.all method.
  Promise.all([categories, statuses, userTypes, addressTypes]) //No need to create a new Promise object!!!
    .then(([categoriesList, statusesList, userTypesList, addressTypesList]) => {
      //The result is an array of results that matches the order of parameters pased to Promise.all() no mather the order of resolving.
      setText("");

      appendText(JSON.stringify(categoriesList.data));
      appendText(JSON.stringify(statusesList.data));
      appendText(JSON.stringify(userTypesList.data));
      appendText(JSON.stringify(addressTypesList.data));
    })
    .catch(reasons => {
      setText(reasons);
    });
}
//What if you dont need all the info that promises return? or you want to work with what you got no matter if is incomplete?
export function allSettled() {
  //CHECK BROWSER COMPATIVILITY FOR THIS METHOD!!!!!!
  let categories = axios.get("http://localhost:3000/itemCategories");
  let statuses = axios.get("http://localhost:3000/orderStatuses");
  let userTypes = axios.get("http://localhost:3000/userTypes");
  //What happens if one promise fails??
  let addressTypes = axios.get("http://localhost:3000/addressTypes");
  //Promise.all will wait until ALL PROMISES ARE FULFILLED OR ONE IS REJECTED

  //How to execute all the request and wait to have the responses that exist and dont mind the failed one,  before execute another function??? use Promises.allSettled method.
  //Promise.allSettled returns ALL PROMISES EVEN IF THEY ARE RJECTED SO OFFICIALLLY YOU DONT NEED A catch() FUNCTION BUT IS GOOD PRCTICE TO HAVE IT.
  Promise.allSettled([categories, statuses, userTypes, addressTypes]) //No need to create a new Promise object. Returns an object:
    //{status: "fulfilled", value: {}}
    //or
    //{status: "rejected", reason: {}}
    .then(values => {
      //Since we receive fulfilled and rejected promise, we should check the status in order to get only the fulfilled data.
      let results = values.map(v => {
        if (v.status === "fulfilled") {
          return `FULFILLED: ${JSON.stringify(v.value.data[0])} `; //The empty space at the end helps to format on small screen
        } else {
          return `REJECTED: ${v.reason.message} `; //The empty space at the end helps to format on small screen
        }
      });

      setText(results);
    })
    .catch(reasons => {
      setText(reasons);
    });
}
//Get the data of the faster promise responding(Good when you have many endpoints globally. this will reduce the time to serve the data depending on the user location.
export function race() {
  let users = axios.get("http://localhost:3000/users");
  let backup = axios.get("http://localhost:3001/users");

  //Get the first to settle only by using Promise.race(). After the first is settled the promise stops. f this first is rejected, the promise will call te catch() function and wont get the data.
  Promise.race([users, backup])
    .then(users => setText(JSON.stringify(users.data)))
    .catch(reason => setText(reason));
}
