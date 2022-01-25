import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

import { Doc } from './doc';

export default {
    toFirestore(doc: Doc): DocumentData {
        return doc;
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): Doc {
        const data = snapshot.data(options)!;
        const doc = {
            id: snapshot.id,
            ...<any>data
        }
        return doc;
    }
};
