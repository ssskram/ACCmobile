
// user
export interface user {
    email: string
    organization: string
    name: string
}

// message
export interface messsage {
    message: string
}

// incidents
export interface incidents {
    incidents: incident[]
}
export interface incident {
    uuid: any
    link: any;
    date: any;
    address: any;
    itemId: any;
    coords: any;
    reasonForVisit: any;
    note: any;
    ownersLastName: any;
    ownersFirstName: any;
    ownersTelephoneNumber: any;
    pghCode: any;
    citationNumber: any;
    comments: any;
    callOrigin: any;
    submittedBy: any;
    modifiedBy: any;
    officerInitials: any;
    open: any;
}