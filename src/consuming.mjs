import setText, { appendText, showWaiting, hideWaiting } from "./results.mjs";

export function get() {
  axios
    .get("http://localhost:3000/orders/1")
    //handle fulfilled state: use then which will call the function that receives as paramenter after the promise is fulfilled and succeed
    .then(({ data }) => {
      //destructuring the response object to get only the property data
      setText(JSON.stringify(data));
    });
}

export function getCatch() {
  axios
    .get("http://localhost:3000/orders/13443")
    /*Example of a failed promise. as the result is a 404 the promise will fail and we have to handle the rejected promise with the function catch()
    //handle fulfilled state: use then which will call the function that receives as paramenter after the promise is fulfilled and succeed
    .then(result => {
        
        //geting the whole response content  of the promise  as result to get the error code on the browser
        if (result.status === 200) {
            setText(JSON.stringify(data));
        } else {
            setText("Error");
        }
    });*/
    .then(({ data }) => {
      //destructuring the response object to get only the property data
      setText(JSON.stringify(data));
    })
    //handling the rejected promise with catch(error) function which takes one parameter: error o reason of failure that is passed to the promise object when it is rejected.
    .catch(error => setText(error));
}

export function chain() {
  axios
    .get("http://localhost:3000/orders/1")
    .then(({ data }) => {
      //the result of the first promise MUST BE RETURNE TO BE USED IN THE SECOND FUNCTION
      return axios.get(
        `http://localhost:3000/addresses/${data.shippingAddress}`
      );
    }) //The chain is possible because promises return promises so we can atttach then() to the first promise.
    .then(({ data }) => {
      setText(`City: ${data.city}`);
    });
}

export function chainCatch() {
  axios
    .get("http://localhost:3000/orders/1")
    .then(({ data }) => {
      return axios.get(
        `http://localhost:3000/addresses/${data.shippingAddress}`
      );
    })
    .then(({ data }) => {
      setText(`City: ${data.city}`);
    })
    //catch() function will cathc ANY ERROR IN THE CHAIN =)...
    .catch(error => setText(error));
}
export function final() {
  //Show loading indicator
  showWaiting();
  axios
    .get("http://localhost:3000/orders/1")
    .then(({ data }) => {
      return axios.get(
        `http://localhost:3000/addresses/${data.shippingAddress}`
      );
    })
    .then(({ data }) => {
      setText(`City: ${data.city}`);
    })
    //catch() function will catch ANY ERROR IN THE CHAIN =)...
    .catch(error => setText(error))
    //After having handled the succes and reject of promise, we can perfor a final action
    .finally(() => {
      //Set timeout is used ONLY to slow up the response and have the oportunity to see the loader indicator.
      setTimeout(() => {
        hideWaiting();
      }, 1500);
      appendText("--Finally and complete done ");
    });
}
