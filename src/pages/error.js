import { Link } from "react-router-dom"

export default function Error() {
    return (
        <>

            <h1>Error 404</h1>
            <p>Page not found</p>
            <Link to='/'>Back to home page</Link>
        </>

    )
}