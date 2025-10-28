const TICKET_KEY = "ticketapp_tickets_v1";
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const VALID_STATUSES = ["open", "in_progress", "closed"];

function read() {
  return JSON.parse(localStorage.getItem(TICKET_KEY) || "[]");
}
function write(data) {
  localStorage.setItem(TICKET_KEY, JSON.stringify(data));
}

export async function fetchTickets() {
  await delay(350);
  return read();
}

export async function createTicket(payload) {
  await delay(400);
  // validation
  if (!payload.title || !payload.title.trim()) {
    const err = new Error("Title is required");
    err.code = "VALIDATION";
    throw err;
  }
  if (!VALID_STATUSES.includes(payload.status)) {
    const err = new Error("Status must be one of open, in_progress, closed");
    err.code = "VALIDATION";
    throw err;
  }
  const t = { id: Date.now(), title: payload.title.trim(), description: payload.description?.trim() || "", priority: payload.priority || "normal", status: payload.status };
  const all = [t, ...read()];
  write(all);
  return t;
}

export async function fetchOneTicket(id){
  await delay(250)
  if(id){
    const all = read()
    const i = all.findIndex((x) => Number(x.id ) === Number(id));
    if (i === -1) {
      const err = new Error("Ticket not found");
      err.code = "NOT_FOUND";
      throw err;
    }

    const ticket = all.find((t) => Number(t.id) === Number(id))
    return ticket;
  }
}

export async function updateTicket(id, updates) {
  await delay(400);
  const all = read();
  const i = all.findIndex((x) => Number(x.id) === Number(id));
  if (i === -1) {
    const err = new Error("Ticket not found");
    err.code = "NOT_FOUND";
    throw err;
  }
  if (updates.title !== undefined && !updates.title.trim()) {
    const err = new Error("Title is required");
    err.code = "VALIDATION";
    throw err;
  }
  if (updates.status !== undefined && !VALID_STATUSES.includes(updates.status)) {
    const err = new Error("Status must be open, in_progress, or closed");
    err.code = "VALIDATION";
    throw err;
  }
  all[i] = { ...all[i], ...updates };
  write(all);
  return all[i];
}

export async function deleteTicket(id) {
  await delay(300);
  const all = read();
  write(all.filter((t) => t.id !== id));
  return true;
}

export async function logout(){
  await delay(200);
  localStorage.removeItem("ticketapp_session")
}