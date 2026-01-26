import Footer from "../components/footer";
import NavigationBar from "../components/navBar";
import "./register.css";

export default function Register() {
  return (
    <div id="overhaul-v2-root">
      <NavigationBar />

      <main className="register-container">
        <div className="register-card">
          <h1 className="register-title">GDG on Campus Event Registration</h1>
          <p className="register-subtitle">
            Join Google Developer Groups on Campus!
          </p>

          <form className="register-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input id="fullName" name="fullName" type="text" placeholder="Enter your full name" required />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="Enter your email" required />
            </div>

            <div className="form-group">
              <label>University / Campus</label>
              <input type="text" placeholder="Enter your campus name" required />
            </div>

            <div className="form-group">
              <label>Year Level</label>
              <select required>
                <option value="">Select year level</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Preferred Track</label>
              <select required>
                <option value="">Select track</option>
                <option>Web Development</option>
                <option>Mobile Development</option>
                <option>AI / Machine Learning</option>
                <option>Cloud Computing</option>
                <option>UI / UX</option>
              </select>
            </div>

            <button type="submit" className="register-btn">
              Register Now
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
