//How call backs work
const showMessage = (messageWee) => {
  console.log(messageWee);
};

const firstM = (callback) => {
  setTimeout(() => {
    showMessage("Hello, Hello, I'm out here to introduce myself");
    callback();
  }, 2000);
};

const secondM = () => {
  showMessage("world");
};

firstM(secondM);

//
//
//
//
// Promises

const promise = new Promise((resolve, reject) => {
  const randomNumber = Math.floor(Math.random() * 10);

  setTimeout(() => {
    if (randomNumber < 5) {
      resolve(`Something happened = ${randomNumber}`);
    } else {
      reject("No no nana naaaa!");
    }
  }, 5000);
});

promise
  .then((result) => {
    console.log("Resolved:", result);
  })
  .catch((error) => {
    console.log("Rejected:", error);
  });
