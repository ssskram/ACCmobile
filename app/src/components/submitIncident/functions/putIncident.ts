export default async function putIncident(newIncident) {
  const status = await fetch(
    "https://365proxy.azurewebsites.us/accmobile/updateIncident",
    {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + process.env.REACT_APP_365_API,
        "Content-Type": "application/json"
      }),
      body: newIncident
    }
  ).then(res => res.status);
  if (status == 200) return true;
  else return false;
}
