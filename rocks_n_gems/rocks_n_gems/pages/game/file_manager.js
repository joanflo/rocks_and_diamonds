


function saveFile(fileName, board) {

    // saving a new file or overwritting file
    Windows.Storage.KnownFolders.documentsLibrary.createFileAsync(fileName + ".lvl", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (file) {

        var memoryStream = new Windows.Storage.Streams.InMemoryRandomAccessStream();
        var dataWriter = new Windows.Storage.Streams.DataWriter(memoryStream);

        // Format: total time, gems number, dynamite number, character position (i,j), board matrix (n, m)
        var totalTime = board.getTotalTime();
        dataWriter.writeInt32(totalTime);

        var gemsNumber = board.getGemsNumber();
        dataWriter.writeInt32(gemsNumber);

        var dynamiteNumber = board.getDynamiteNumber();
        dataWriter.writeInt32(dynamiteNumber);

        var characterPosition = board.getCharacter().getPosition();
        dataWriter.writeInt32(characterPosition.i);
        dataWriter.writeInt32(characterPosition.j);

        var boardMatrix = board.getBoardMatrix();
        var n = boardMatrix.length;
        dataWriter.writeInt32(n);
        var m = boardMatrix[1].length;
        dataWriter.writeInt32(m);
        for (var i=0; i<n; i++) {
            for (var j=0; j<m; j++) {
                dataWriter.writeByte(boardMatrix[i][j]);
            }
        }

        var buffer = dataWriter.detachBuffer();
        dataWriter.close();
        if (Windows.Storage.FileIO.writeBufferAsync(file, buffer)) {
            var msg = new Windows.UI.Popups.MessageDialog("The file '" + fileName + "' was correctly saved.");
            msg.showAsync();
        }

    });
}


function openFile() {
    WinJS.Navigation.navigate("/pages/file_explorer/file_explorer.html");
}


function loadFile(dataReader, board) {
    // Format: total time, gems number, dynamite number, character position (i,j), board matrix (n, m)
    var totalTime = dataReader.readInt32();
    board.setTotalTime(totalTime);

    var gemsNumber = dataReader.readInt32();
    board.setGemsNumber(gemsNumber);

    var dynamiteNumber = dataReader.readInt32();
    board.setDynamiteNumber(dynamiteNumber);

    var i = dataReader.readInt32();
    var j = dataReader.readInt32();
    board.getCharacter().setPosition(i, j);

    var n = dataReader.readInt32();
    var m = dataReader.readInt32();
    var boardMatrix = new Array(n);
    for (i = 0; i < n; i++) {
        boardMatrix[i] = new Array(m);
        for (j = 0; j < m; j++) {
            boardMatrix[i][j] = dataReader.readByte();
        }
    }
    board.setBoardMatrix(boardMatrix);
}