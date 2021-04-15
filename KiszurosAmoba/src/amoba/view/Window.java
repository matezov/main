package amoba.view;

import amoba.model.Board;
import amoba.model.Point;
import amoba.model.Symbol;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import static javax.swing.WindowConstants.EXIT_ON_CLOSE;

public class Window extends JFrame {
    
    JMenuBar menuBar = new JMenuBar();
    JMenu gameMenu = new JMenu("Játék");
    JMenuItem newGameMenuItem = new JMenuItem("Új játék");
    JMenuItem exitMenuItem = new JMenuItem("Kilép");
    JMenu helpMenu = new JMenu("Súgó");
    
    private int size;
    
    JPanel panel = new JPanel();
    private Board board;
    
    private JButton[][] gameBoard;
    
    public Window() {
        super("Amőba");
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setJMenuBar(menuBar);
        
        menuBar.add(gameMenu);
        gameMenu.add(newGameMenuItem);
        gameMenu.add(exitMenuItem);
        gameMenu.addSeparator();
        gameMenu.add(exitMenuItem);
        
        menuBar.add(helpMenu);
        
        newGameMenuItem.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                newBoard();
            }            
        });
        
        exitMenuItem.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
               exit();
            }            
        });
        newBoardSize();
    }
    
    public void newBoardSize() {
        getContentPane().removeAll();
        panel.removeAll();
        JButton small = new JButton();
        small.setText("Kicsi - 6 x 6");
        
        small.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                size = 6;
                newGame();
            }
        });
        
        JButton medium = new JButton();
        medium.setText("Közepes - 10 x 10");
        medium.setSize(50, 50);
        
        medium.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                size = 10;
                newGame();
            }
        });
        
        JButton large = new JButton();
        large.setText("Nagy - 14 x 14");
        
        large.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                size = 14;
                newGame();
            }
        });
        
        getContentPane().setLayout(new FlowLayout());
        getContentPane().add(small);
        getContentPane().add(medium);
        getContentPane().add(large);
        
        setLocationRelativeTo(null);
        this.pack();
    }
    
    public void newGame() {
        panel.removeAll();
        getContentPane().removeAll();
        board = new Board(size);
        gameBoard = new JButton[size][size];
        panel.setLayout(new GridLayout(size, size));
        getContentPane().add(panel, BorderLayout.CENTER);
        
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                gameBoard[i][j] = addButton(i, j);
                
            }
        }
        setLocationRelativeTo(null);
        this.pack();
    }
    
    private JButton addButton(final int i, final int j) {
        final JButton button = new JButton();
        button.setBackground(Color.LIGHT_GRAY);
        button.addActionListener(new ActionListener() {
           @Override
           public void actionPerformed(ActionEvent e) {
               Symbol newSym = board.step(i, j);
               button.setText(newSym.name());
               button.setBackground(Color.LIGHT_GRAY);
               Symbol winner = board.findWinner(i, j, newSym, 5, size);
                if (winner != Symbol.UNFILLED) {
                    showWinnerMessage(winner);
                }
                
                if (board.draw()) {
                    showDrawMessage();
                }
                
                if (board.someInARow(newSym, i, j, 3, 3)) {
                    Point p = board.trick(newSym);
                    deleteField(p.x, p.y);
                }
                
                if (board.someInARow(newSym, i, j, 4, 4)) {
                    Point p = board.trick(newSym);
                    deleteField(p.x, p.y);
                    Point p2 = board.trick(newSym);
                    deleteField(p2.x, p2.y);
                }
           }
        });
        button.setPreferredSize(new Dimension(50, 50));
        panel.add(button);
        this.pack();
        return button;
    }
    
    public void newBoard() {
        String[] options = new String[] {"Kicsi", "Közepes", "Nagy"};
        int answer = JOptionPane.showOptionDialog(null, "Válassz pályaméretet: "
                , "Pályaméret",
        JOptionPane.DEFAULT_OPTION, JOptionPane.PLAIN_MESSAGE,
        null, options, options[0]);

        switch (answer) {
            case 0:
                size = 6;
                break;
            case 1:
                size = 10;
                break;
            case 2:
                size = 14;
                break;
        }
        newGame();
    }
    
    public void showDrawMessage() {
        JOptionPane.showMessageDialog(this, "Döntetlen.");
        newGame();
    }
    
    public void deleteField(int i, int j) {
        gameBoard[i][j].setText("");
        gameBoard[i][j].setBackground(Color.RED);
    }
    
    private void showWinnerMessage(Symbol winner) {
        JOptionPane.showMessageDialog(this,
                "Játék vége. Nyert: " + winner.name());
        newGame();
    }
    
    public void exit() {
        int v = JOptionPane.showConfirmDialog(this, "Biztosan kilép?",
                "Megerősítés", JOptionPane.YES_NO_OPTION);
        if (v == JOptionPane.YES_OPTION) {
            System.exit(0);
        }
    }
    
}