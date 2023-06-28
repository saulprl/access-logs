import { DatabaseProvider, FirestoreProvider, useFirebaseApp } from "reactfire";
import { LogList } from "./components/molecules/log-list/log-list.component";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

function App() {
  const firebaseApp = useFirebaseApp();
  const firestore = getFirestore(firebaseApp);
  const database = getDatabase(firebaseApp);

  return (
    <FirestoreProvider sdk={firestore}>
      <DatabaseProvider sdk={database}>
        <LogList />
      </DatabaseProvider>
    </FirestoreProvider>
  );
}

export default App;
