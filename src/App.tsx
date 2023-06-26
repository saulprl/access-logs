import { FirestoreProvider, useFirebaseApp } from "reactfire";
import { LogList } from "./components/molecules/log-list/log-list.component";
import { getFirestore } from "firebase/firestore";

function App() {
  const firebaseApp = useFirebaseApp();
  const firestore = getFirestore(firebaseApp);

  return (
    <FirestoreProvider sdk={firestore}>
      <LogList />
    </FirestoreProvider>
  );
}

export default App;
