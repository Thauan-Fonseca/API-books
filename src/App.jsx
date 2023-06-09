import { useState,useEffect } from 'react';
import axios from 'axios';
import {Container, Card, Button } from 'react-bootstrap';

function App() {

  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({title: "", pages: ""})

  useEffect(() => {
    axios.get("http://localhost:3000/books")
    .then((response) => {
      setBooks(response.data.books)
    }) 
    .catch((err)=> {
      console.log(err)
    }) 
  }, [])
  
  function handleChange (evento) {
    const {name, value} = evento.target
    setNewBook({...newBook, [name]: value})
  }

  function handleSubmit(evento) {
    evento.preventDefault()
    axios.post("http://localhost:3000/books", newBook)
    .then((response) => {
      console.log(response.data)
      setBooks([...books, {id: response.data.id, ...newBook}]);
      setNewBook({title: "", pages: ""})
    }).catch((err) => console.log(err))
  }

  const handleDelete = (id) => {
    if(window.confirm("Tem certeza que deseja apagar o livro?")){
      axios.delete(`http://localhost:3000/books/${id}`)
      .then((response) => {
        setBooks(books.filter((book) => book.id !== id))
      })
      .catch((err) => console.log(err))
    }
  }


  return (
    <Container>
      <h1>Livros</h1>
      <div className='row'>
        {books && books.map((book) => (
          <div className="col-md-4 mb-4" key={book.id}>
            <Card>
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <Card.Subtitle className='mb-2 text-muted'>
                  {books.pages} Páginas
                </Card.Subtitle>
                <Button variant='danger' onClick={() => handleDelete(book.id)}>Remover</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      <hr/>
      <h2>Novo livro</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor="title">Título:</label>
          <input 
            type="text" className='form-control' id='title' 
            name='title' 
            value={newBook.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor="pages">Número de páginas</label>
          <input 
            type="number" className='form-control' id='pages' 
            name='pages' 
            value={newBook.pages}
            onChange={handleChange}
            required
          />
        </div>
        <button type='submit' className='btn btn-primary mt-2'>Adicionar livro</button>
      </form>
    </Container>
  )
}

export default App
