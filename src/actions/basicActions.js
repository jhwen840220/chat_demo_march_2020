import { db } from "../plugins/firebase";


export const getData_byFB = (route) => {
  return new Promise((resolve, reject)=>{
    db.ref(route).once("value", function(snapshot) {
      var data = snapshot.val();
      resolve(data);
    })
  })
}

export const pushData_byFB = (route, postData) => {
  db.ref(route)
    .push(postData)
    .then(function() {
      console.log('send message')
    })
    .catch(async function() {
      console.log('send failed')
    });
}

export const updateData_byFB = (route, postData) => {
  db.ref(route)
    .update(postData)
    .then(function() {
      console.log('send message')
    })
    .catch(async function() {
      console.log('send failed')
    });
}