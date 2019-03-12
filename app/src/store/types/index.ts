
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
    uuid: string
    link: string
    date: string
    address: string
    itemId: number
    coords: string
    reasonForVisit: string
    note: string
    ownersLastName: string
    ownersFirstName: string
    ownersTelephoneNumber: string
    pghCode: string
    citationNumber: string
    callOrigin: string
    submittedBy: string
    modifiedBy: string
    comments: string
    officerInitials: string
    open: string
}

// comments
export interface comment {
    commentId: number
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