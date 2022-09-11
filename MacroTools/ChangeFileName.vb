Option Explicit

'ファイル名に文字を追加する機能
Sub Add_text_to_fileName()
    Dim file As String, fso As Object
    Dim folderPath As String, addText As String, filePath As String
    
    '対象ファイルがあるフォルダを取得し、xlsxファイルを取得
    On Error GoTo Out
    With Application.FileDialog(msoFileDialogFolderPicker)
        .Show
        folderPath = .SelectedItems(1)
    End With
    
    '配下全ファイルを対象とする
    file = Dir(folderPath & "\*.*")
    
    'ファイルがあれば、付加する文字列を指定してもらう
    If file <> "" Then
        addText = InputBox("ファイル名の先頭に追加する文字列を入力してください")
    Else
        MsgBox "配下に対象ファイルがありません", vbInformation
        Exit Sub
    End If
    
    'addtextを入力しなければ以降の処理をスキップ
    If addText = "" Then
        MsgBox "追加文字列が入力されませんでした", vbInformation
        Exit Sub
    End If
    
    'ファイルオブジェクトを生成
    Set fso = CreateObject("Scripting.FileSystemObject")
    
    Application.ScreenUpdating = False
    
    '選択したフォルダ配下のファイルを全て読み込む
    Do While file <> ""
        'フォルダ＋ファイル名を取得
        filePath = folderPath & "\" & file
        'filePathを文字列からファイル型へ変換し、追加文字を加えてファイル名変更を行う
        fso.GetFile(filePath).Name = addText & "_" & file
        '次のファイルへ
        file = Dir()
    Loop
    
    Application.ScreenUpdating = True
    
    MsgBox "ファイル名への追加が完了しました", vbInformation
    
Out:

End Sub


'ファイル名から特定の文字列を除去する
Sub Remove_text_from_fileName()
    Dim file As String, cnt As Long, fso As Object, errCnt As Integer
    Dim folderPath As String, rmvText As String, filePath As String
    
    '対象ファイルがあるフォルダを取得し、xlsxファイルを取得
    On Error GoTo Out
    With Application.FileDialog(msoFileDialogFolderPicker)
        .Show
        folderPath = .SelectedItems(1)
    End With
    
    '配下全ファイルを対象とする
    file = Dir(folderPath & "\*.*")
    
    'ファイルがあれば、付加する文字列を指定してもらう
    If file <> "" Then
        rmvText = InputBox("ファイル名から除去する文字列を入力してください")
    Else
        MsgBox "配下に対象ファイルがありません", vbInformation
        Exit Sub
    End If
    
    'rmvTextを入力しなければ以降の処理をスキップ
    If rmvText = "" Then
        MsgBox "除去文字が入力されませんでした", vbInformation
        Exit Sub
    End If
    
    'ファイルオブジェクトを生成
    Set fso = CreateObject("Scripting.FileSystemObject")
    
    Application.ScreenUpdating = False
    
    cnt = 0
    '選択したフォルダ配下のファイルを全て読み込む
    Do While file <> ""
        
        On Error Resume Next
        
        'フォルダ＋ファイル名を取得
        filePath = folderPath & "\" & file
        'filePathを文字列からファイル型へ変換し、除去文字を指定してファイル名から除去
        fso.GetFile(filePath).Name = Replace(file, rmvText & "_", "")
        
        '変換できないものをカウント
        If Err.Number = 58 Then
            errCnt = errCnt + 1
        End If
        
        '次のファイルへ
        cnt = cnt + 1
        file = Dir()
    Loop
    
    Application.ScreenUpdating = True
    
    '変換できなかったファイルを含む場合と正常終了の場合
    If errCnt > 0 Then
        MsgBox "除去できなかったファイルが" & errCnt & "件あります", vbExclamation
    Else
        MsgBox cnt & "件のファイル名の修正が完了しました", vbInformation
    End If
  
'エラーハンドリング
Out:
    'ファイルダイアログでキャンセルまたは×とした場合
    If Err.Number = 5 Then
        Exit Sub
    End If
    


End Sub
