document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let width = 10
    let flags = 0 
    let bombAmounts = 20
    let squares = []
    let isGameOver = false
    let firstClick = 0

    //create the board of the game
    function createBoard(){
        //create random game array and place random bombs
        const bombArrays = Array(bombAmounts).fill('bombs')
        const emptyArrays = Array(width*width - bombAmounts).fill('valid')
        const gameArrays = emptyArrays.concat(bombArrays)
        const randomArrays = gameArrays.sort(() => Math.random() - 0.5)
        console.log(randomArrays)

        for(let i = 0;i<width*width;i++){
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(randomArrays[i])
            grid.appendChild(square)
            squares.push(square)

        //left click
        square.addEventListener('click', function(e){
            click(square)
            firstClick++
        })

        //right click
        square.oncontextmenu = function(e){
            e.preventDefault()
            addFlags(square)
        }
        }
    }
    createBoard() 
    checkTotal()

    //check total by adding numbers
    function checkTotal(){
        for(let i = 0;i < squares.length; i++){
            let total = 0;
            const isLeftColumn = (i % width === 0)
            const isRightColumn = (i % width === width - 1)
            
            if(squares[i].classList.contains('valid')){
                //check left
                if(i > 0 && !isLeftColumn && squares[i - 1].classList.contains('bombs')) total++ 
                //check top right
                if(i > width-1 && !isRightColumn && squares[i + 1 - width].classList.contains('bombs')) total++
                //check top
                if(i > width && squares[i - width].classList.contains('bombs')) total++
                //check bottom
                if(i < (width*width) - width - 1 && squares[i + width].classList.contains('bombs')) total++
                //check top left
                if(i > width + 1 && !isLeftColumn && squares[i - 1 - width].classList.contains('bombs')) total++
                //check right
                if(i < (width*width) - 1 && !isRightColumn && squares[i + 1].classList.contains('bombs')) total++
                //check bottom left
                if(i < (width*width) - width && !isLeftColumn && squares[i - 1 + width ].classList.contains('bombs')) total++
                //check bottom right
                if(i < (width*width) -width - 2 && !isRightColumn && squares[i + 1 +width].classList.contains('bombs')) total++
                squares[i].setAttribute('data', total)
                console.log(squares[i])
            }
        }
    }

    //adding flags
    function addFlags(square){
        if(isGameOver) return
        if(!square.classList.contains('clicked') && (flags < bombAmounts)){
            if(!square.classList.contains('flags')){
                square.classList.add('flags')
                square.innerHTML = '🚩'
                flags++
                checkWin()
            }
            else{
                square.classList.remove('flags')
                square.innerHTML = ''
                flags--
            }
        }
    }

    //click on square actions
    function click(square){
        let currentID = square.id
        let total = square.getAttribute('data')
        if(isGameOver) return
        if(square.classList.contains('clicked') || square.classList.contains('flag')) return
        if(firstClick != 0 && square.classList.contains('bombs')){
            gameOver(square)
        }else if(firstClick === 0 && square.classList.contains('bombs')){
            //alert('This was a bomb! Since this is your first click, You got another chance!')
            square.classList.replace('bombs','valid')
            square.classList.add('clicked')
            bombAmounts -= 1
            checkTotal()
            total = square.getAttribute('data')
            if(total != 0) {
                square.classList.add('clicked')
                square.innerHTML = total
                return
            }
            checkSquare(square,currentID)
        }
        else{
            if(total != 0){
                square.classList.add('clicked')
                square.innerHTML = total
                return
            }
            checkSquare(square, currentID)
        }
        square.classList.add('clicked')
    }

    //by using recursion, checked surrounding squares after a square is clicked(same logic as checking bomb)
    function checkSquare(square, currentID){
        const isLeftColumn = (currentID % width === 0)
        const isRightColumn = (currentID % width === width - 1)

        setTimeout(() => {
            //check left
            if(currentID > 0 && !isLeftColumn){
                const newID = squares[parseInt(currentID) - 1].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            //check top right
            if(currentID > width-1 && !isRightColumn){
                const newID = squares[parseInt(currentID) + 1 - width].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            //check top
            if(currentID > width){
                const newID = squares[parseInt(currentID) - width].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            //check bottom
            if(currentID < width*width - width - 1 && !isLeftColumn){
                const newID = squares[parseInt(currentID) + width].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            //check top left
            if(currentID > width + 1 && !isLeftColumn){
                const newID = squares[parseInt(currentID) - 1 - width].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            //check right
            if(currentID < width*width - 1 && !isRightColumn){
                const newID = squares[parseInt(currentID) + 1].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            //check bottom left
            if(currentID < width*width - width && !isLeftColumn){
                const newID = squares[parseInt(currentID) - 1 + width].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            //check bottom right
            if(currentID < width*width - width - 2 && !isRightColumn){
                const newID = squares[parseInt(currentID) + 1 + width].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
        }, 10)
    }

    //game over
    function gameOver(square){
        //show all bombs
        squares.forEach(square => {
            if(square.classList.contains('bombs')){
                square.innerHTML = '💣'
                firstClick = 0
            }
        })
        alert("You Lost!!!")
        isGameOver = true
    }

    //check for win
    function checkWin(){
        let matches = 0
        for(let i = 0; i < squares.length ; i++){
            if(squares[i].classList.contains('flags') && squares[i].classList.contains('bombs')){
                matches++
            }
            if(matches === bombAmounts){
                alert("You Win!!!")
                isGameOver = true
            }
        }
    }
})