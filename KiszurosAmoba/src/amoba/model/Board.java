package amoba.model;

import java.util.ArrayList;
import java.util.Random;

public class Board {

    private int size;
     
    private Symbol[][] gameBoard;
    private Symbol actualPlayer;
    
    private int freeField;
    
    private ArrayList<Point> symX = new ArrayList<>();
    private ArrayList<Point> symO = new ArrayList<>();

    public Board(int size) {
       this.size = size;
       gameBoard = new Symbol[size][size];
       actualPlayer = Symbol.X;
       freeField = size * size;
       
       for (int i=0; i < size; ++i) {
            for (int j=0; j < size; ++j) {
                gameBoard[i][j] = Symbol.UNFILLED;
            }
        }
       
    }

    public Symbol step(int i, int j) {
        if (gameBoard[i][j] != Symbol.UNFILLED) {
            return gameBoard[i][j];
        }
        gameBoard[i][j] = actualPlayer;
        --freeField;
        if (actualPlayer == Symbol.X) {
            symX.add(new Point(i, j));
        }
        
        if (actualPlayer == Symbol.O) {
            symO.add(new Point(i, j));
        }
        
        if (actualPlayer == Symbol.X) {
            actualPlayer = Symbol.O;
        } else {
            actualPlayer = Symbol.X;
        }

        return gameBoard[i][j];
    }

    public Point trick(Symbol sym) {
        Symbol temp = sym;
        int rand;
        ++freeField;
        if (temp == Symbol.X) {
            rand = getRandomNumber(0, symX.size() - 1);
            Point p = symX.get(rand);
            symX.remove(rand);
            gameBoard[p.x][p.y] = Symbol.UNFILLED;
            return p;
        }
        if (temp == Symbol.O) {
            rand = getRandomNumber(0, symO.size() - 1);
            Point p = symO.get(rand);
            symO.remove(rand);
            gameBoard[p.x][p.y] = Symbol.UNFILLED;
            return p;
        }
        
        return null;
    }

    public boolean someInARow(Symbol sym, int i, int j, int symNumMin, int symNumMax) {
        return findWinner(i, j, sym, symNumMin, symNumMax) != Symbol.UNFILLED;
    }
    
    private static int getRandomNumber(int min, int max) {
	Random r = new Random();
	return r.nextInt((max - min) + 1) + min;
    }
    
    public Symbol findWinner(final int x, final int y, Symbol sym, int symNumMin, int symNumMax) {
        // Vízszintes ellenőrzés
        int c = 1;
        for (int j = y + 1; j < y + symNumMin && isInRange(x,j) && gameBoard[x][j] == sym ; ++j) {
            ++c;
        }
        for (int j = y - 1; j > y - symNumMin && isInRange(x,j) && gameBoard[x][j] == sym ; --j) {
            ++c;
        }
        if (c >= symNumMin && c <= symNumMax) return sym;
        
        // Függőleges ellenőrzés
        c = 1;
        for (int i = x + 1; i < x + symNumMin && isInRange(i,y) && gameBoard[i][y] == sym ; ++i) {
            ++c;
        }
        for (int i = x - 1; i > x - symNumMin && isInRange(i,y) && gameBoard[i][y] == sym ; --i) {
            ++c;
        }
        if (c >= symNumMin && c <= symNumMax) return sym;
        
        
        // Átlós ellenőrzés 1
        c = 1;
        int a = x + 1;
        int b = y + 1;
        while (isInRange(a,b) && a < x + symNumMin && b < y + symNumMin && gameBoard[a][b] == sym) {
            ++c;
            ++a;
            ++b;
        }
        a = x - 1;
        b = y - 1;
        while (isInRange(a,b) && a > x - symNumMin && b > y - symNumMin && gameBoard[a][b] == sym) {
            ++c;
            --a;
            --b;
        }
        if (c >= symNumMin && c <= symNumMax) return sym;
        
        // Átlós ellenőrzés 2
        c = 1;
        a = x + 1;
        b = y - 1;
        while (isInRange(a,b) && a < x + symNumMin && b > y - symNumMin && gameBoard[a][b] == sym) {
            ++c;
            ++a;
            --b;
        }
        a = x - 1;
        b = y + 1;
        while (isInRange(a,b) && a > x - symNumMin && b < y + symNumMin && gameBoard[a][b] == sym) {
            ++c;
            --a;
            ++b;
        }
        if (c >= symNumMin && c <= symNumMax) return sym;
        
        return Symbol.UNFILLED;
    }
    
    public boolean isInRange(int a, int b) {
        return a < size && b < size && a >= 0 && b >= 0;
    }
    
    public Symbol getActualPlayer() {
        return actualPlayer;
    }
    
    public int getSize() {
        return size;
    }
    
    public boolean draw() {
        return freeField == 0;
    }
}