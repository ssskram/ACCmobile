
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

// comments
export interface comment {
    dateTime: string
    incidentID: string
    user: string
    comment: string
}

// dropdowns
export interface dropdowns {
    animalBreeds: animalBreeds[]
    animalCoats: animalCoats[]
    veterinarians: veterinarians[]
    reasonsForVisit: reasonsForVisit[]
    callOrigins: callOrigins[]
    officerInitials: officerInitials[]
    citationNumbers: citationNumbers[]
}
export interface animalBreeds {
    type: string
    breed: string
}
export interface animalCoats {
    type: string
    coat: string
}
export interface veterinarians {
    vet: string
}
export interface reasonsForVisit {
    reason: string
}
export interface callOrigins {
    origin: string
}
export interface officerInitials {
    initial: string
}
export interface citationNumbers {
    number: string
}