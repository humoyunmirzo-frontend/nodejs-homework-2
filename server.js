const http = require('http');
const url = require('url');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const booksFilePath = './books.json';

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { pathname } = parsedUrl;

    if (req.method === 'GET' && pathname === '/books') {
        fs.readFile(booksFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }
else if (req.method === 'GET' && pathname.startsWith('/books/')) {
    const id = parseInt(pathname.split('/')[2]);
    fs.readFile(booksFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }
        const books = JSON.parse(data);
        const book = books.find(book => book.id === id);
        if (!book) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Book not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(book));
    });
}

    else if (req.method === 'POST' && pathname === '/books') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const newBook = JSON.parse(body);
            fs.readFile(booksFilePath, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }
                const books = JSON.parse(data);
                newBook.id = books.length + 1;
                books.push(newBook);
                fs.writeFile(booksFilePath, JSON.stringify(books, null, 4), (err) => {
                    if (err) {
                        console.error(err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                        return;
                    }
                    res.writeHead(201, { 'Content-Type': 'text/plain' });
                    res.end('Book added successfully');
                });
            });
        });
    }
    else if (req.method === 'PUT' && pathname.startsWith('/books/')) {
        const id = parseInt(pathname.split('/')[2]);
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const updatedBook = JSON.parse(body);
            updatedBook.id = id;
            fs.readFile(booksFilePath, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }
                let books = JSON.parse(data);
                const index = books.findIndex(book => book.id === id);
                if (index === -1) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Book not found');
                    return;
                }
                books[index] = updatedBook;
                fs.writeFile(booksFilePath, JSON.stringify(books, null, 4), (err) => {
                    if (err) {
                        console.error(err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('Book updated successfully');
                });
            });
        });
    }
    else if (req.method === 'DELETE' && pathname.startsWith('/books/')) {
        const id = parseInt(pathname.split('/')[2]);
        fs.readFile(booksFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            let books = JSON.parse(data);
            const index = books.findIndex(book => book.id === id);
            if (index === -1) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Book not found');
                return;
            }
            books.splice(index, 1);
            fs.writeFile(booksFilePath, JSON.stringify(books, null, 4), (err) => {
                if (err) {
                    console.error(err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Book deleted successfully');
            });
        });
    }
    // Handle invalid routes
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
