import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

import { CollectionInfo } from './collection-info';

export default {
    toFirestore(collectionInfo: CollectionInfo): DocumentData {
        return collectionInfo;
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): CollectionInfo {
        const data = snapshot.data(options)!;
        const collectionInfo: CollectionInfo = {
            collectionName: snapshot.id,
            ...<any>data
        }
        return collectionInfo;
    }
};
