import React from "react"
import { Link } from "react-router-dom"

export default function Admin() {
    return (
        <div>
            <h3>ADMIN PAGE</h3>

            <Link to='dashboard'>

                <button>
                    login
                </button>
            </Link>

            <Link to='/'>
                <button>
                    go back
                </button>
            </Link>

        </div>
    )
}