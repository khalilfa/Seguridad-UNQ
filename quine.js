!function quine() {
  console.log('!' + String(quine) + '()');
}()