import React from "react";

import { OPENJOBS } from "../../assets/data/Openjobs";
import {COMPLETEDJOBS} from "../../assets/data/completedJobs"

const jobs = (query) => {

    if (query == "Open") {
        return (OPENJOBS)
    }
    else
        return (COMPLETEDJOBS)

}

export default jobs;