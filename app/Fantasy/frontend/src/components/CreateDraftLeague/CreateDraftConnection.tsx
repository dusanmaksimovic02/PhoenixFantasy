import * as signalR from "@microsoft/signalr";

export const createDraftConnection = (draftId: string) => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7035/draftHub", {
      withCredentials: true,
    })
    .withAutomaticReconnect()
    .build();

  connection.start().then(async () => {
    console.log("SignalR connected");

    await connection.invoke("JoinDraft", draftId);
  });

  return connection;
};
