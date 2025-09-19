import { useMutation, useQuery } from "@apollo/client"
import { ALL_AUTHORS, EDIT_YEAR } from "../quiries"
import { useState } from "react";

const Authors = () => {
  const [yearToChange,setYearToChange]=useState('')
  const [authorToChange,setAuthorToChange]=useState('')
  const result = useQuery(ALL_AUTHORS);
  const [editYear]=useMutation(EDIT_YEAR,{
    refetchQueries:[{ALL_AUTHORS}]
  });
    
    if (result.loading) {
        return <div>loading...</div>
    }
    const authors = result.data.allAuthors

    const editAuthor= async (event)=>{
      event.preventDefault()
      console.log(authorToChange, yearToChange)
      await editYear({ variables: { name: authorToChange, born: yearToChange } });
      setAuthorToChange('')
      setYearToChange('')
    }
    return (
    <div>
        <h2>authors</h2>
        <table>
            <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <form onSubmit={editAuthor}>
          <select onChange={({target})=>setAuthorToChange(target.value)}>
            <option value=""></option>
            {authors.map((a)=>(
              <option value={a.name}>{a.name} {a.born}</option>
            ))}
          </select>
          <input type="number" value={yearToChange} onChange={({target})=>setYearToChange(target.value)}></input>
          <button type="submit">submit</button>
        </form>
      </div>
    </div>
  )
}

export default Authors