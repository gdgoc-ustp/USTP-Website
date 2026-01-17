import './memberCard.css'
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MemberCard({ name, position, photo }) {


    return (
        <div className='container'>


            <img src={photo} alt='picture' className='image' />

            <div className="overlay">
                <div className='title'>

                    <h1>{name}</h1>
                    <p>{position}</p>

                </div>

                <div className='social-links'>
                   <FontAwesomeIcon icon={faCoffee}></FontAwesomeIcon>
                    <p>Socmed links</p>
                    <p>Socmed links</p>
                    <p>Socmed links</p>

                </div>


            </div>



        </div>
    )
}