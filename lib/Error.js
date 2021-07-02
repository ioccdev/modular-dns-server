class Error {

    errors = {
        "A-001": "Flag Hex Stream is not right",
        "B-001": "Class Conversion - Number not known",
        "B-002": "Class Conversion - String not known",
        "C-001": "Type Conversion - Number not known",
        "C-002": "Type Conversion - String not known",
    }

    constructor(e){
        console.error(this.errors[e]);
    }

}

module.exports = Error;