export default async function postImage(state, incidentID) {
  const fileName = setName(state.image[0].name.replace(/[,"+/()'\s]/g, ""));
  const metaObj = {
    incidentID: incidentID,
    relativePath: fileName,
    attachmentTitle: state.imageTitle,
    attachmentDescription: state.imageDescription
  };

  const formData = new FormData();
  formData.append("file", state.image[0]);

  // post image to blob
  await fetch(
    "https://blobby.azurewebsites.us/accMobile/image?filename=" + fileName,
    {
      method: "post",
      body: formData,
      headers: new Headers({
        Authorization: "Bearer " + process.env.REACT_APP_BLOBLY_API
      })
    }
  ).then(async res => {
    // on success, post meta to sp
    await fetch(
      "https://365proxy.azurewebsites.us/accMobile/attachmentMeta?filename=" +
        fileName,
      {
        method: "post",
        body: JSON.stringify(metaObj),
        headers: new Headers({
          Authorization: "Bearer " + process.env.REACT_APP_365_API,
          "Content-Type": "application/json"
        })
      }
    );
  });
}

const setName = originalName => {
  const identifier = Math.random()
    .toString()
    .replace(/0\./, "");
  return `${identifier}-${originalName}`;
};
