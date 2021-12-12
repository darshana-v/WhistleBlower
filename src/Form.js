import React,{useState} from "react";
import './form.css'


function Form() {
    const [values,setValues] = useState({
        title: "",
        description: "",
        category: "",
        proof: "",
        ipfs_link: "",
        date: ""
      });
    
      const handleTitleChange = (event) =>{
        setValues({...values, title: event.target.value})
      }
      const handleDescChange = (event) =>{
        setValues({...values, description: event.target.value})
      }
      const handleCategoryChange = (event) =>{
        setValues({...values, category: event.target.value})
      }
      const handleProofChange = (event) =>{
        setValues({...values, proof: event.target.value})
      }
    
      const handleSubmit = (event) =>{
        alert("form is submitted");
        event.preventDefault();
      }
    return (
        <div className="form">
            <form className="form-content" onSubmit={handleSubmit} >
        <h3>Create your Entry</h3>
        <div className="form">
          <div className="form-left">
            <div className="inputField">
              <label for="title">Title</label>
              <input type="text" name="title" value={values.title} onChange={handleTitleChange} required/>
            </div>
            <div className="inputField">
              <textarea id="desc" placeholder="Add description" value={values.description} onChange={handleDescChange} required></textarea>
            </div>
          </div>

          <div className="form-right">
            <div className="inputField">
              <label for="category">Category</label>
              <input type="text" name="category" value={values.category} onChange={handleCategoryChange} required/>
            </div>
            <div className="inputField">
              <label for="proof">Proof</label>
              <input type="file" name="proof" value={values.proof} onChange={handleProofChange}/>
            </div>
            <div className="inputField">
              <button>Generate IPFS</button>
              <input type="text" value={values.ipfs_link}/>
            </div>
          </div>
        </div>

        <div className="form-buttons">
            <button id="submit" type="submit">Publish</button>
            <button id="cancel" type="reset">Cancel</button>
        </div>
      </form>
    </div>
    )
}

export default Form
