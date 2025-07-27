<<<<<<< HEAD
Option Explicit

'ユーザフォームの入力値格納用の変数
Public select_Val As String
Public addPos_Char As String
Public is_Ok As Boolean

'その他変数
Dim addtext As String, filePath As String, OrgFolderPath As String
Dim FSO As Scripting.FileSystemObject
Dim cnt As Long

'ファイル名に文字を追加する機能（先頭のみに追加するやつの上位互換）
Sub ExecuteFileRename()
    Dim folderPath As String
    Dim fileName As String
    Dim folderCnt As Integer
    cnt = 0
    
    'ファイル操作オブジェクト生成
    Set FSO = CreateObject("Scripting.FileSystemObject")
     
    '対象ファイルがあるフォルダを取得し、配下のファイルを取得
    On Error GoTo Catch
    
Again:
    With Application.FileDialog(msoFileDialogFolderPicker)
        .Show
        folderPath = .SelectedItems(1)
    End With
    
    OrgFolderPath = folderPath
    
    'folderPath配下にsubfolderもファイルもなければ対象ファイルなしとメッセージを出す
    fileName = Dir(OrgFolderPath & "\*.*")
    folderCnt = FSO.GetFolder(OrgFolderPath).subFolders.Count
    
    If folderCnt < 1 And fileName = "" Then
        MsgBox "サブフォルダまたはファイルがありません", vbExclamation
        GoTo Again
    Else
        'ダイアログで入力促す
        addtext = InputBox("ファイル名に反映する文字列を入力してください" & vbCrLf & "※削除の場合は適当な値を入力する")
        If addtext <> "" Then
            Call DisplayUserForm(FSO, OrgFolderPath, addtext)
        Else
            Exit Sub
        End If
    End If
      
    'エラーハンドリング
Catch:
    'ファイル選択でキャンセルを押した場合
    If Err.Number = "5" Then
        Exit Sub
    End If

End Sub


Sub DisplayUserForm(FSO As Object, folderPath As String, addtext As String)
    'ユーザフォームを表示
    AddTextForm.Show
    
    If is_Ok Then
        '配下フォルダとファイルについての処理
        Call DoFolders(FSO, folderPath, addtext)
        If cnt > 0 Then
            MsgBox cnt & "件のファイル名の修正が完了しました", vbInformation
        End If
    End If
End Sub


'フォルダに対しての処理
Sub DoFolders(FSO As Object, folderPath As String, addtext As String)
    Dim folder As Object

    Application.ScreenUpdating = False
    
    'フォルダ数分再帰
    For Each folder In FSO.GetFolder(folderPath).subFolders
        Call DoFolders(FSO, folder.Path, addtext)
    Next
    
    'ファイルについての処理
    Call DoFiles(folderPath, addtext)

    Application.ScreenUpdating = True
    
End Sub


'ファイルに対しての処理
Sub DoFiles(folderPath As String, addtext As String)
    Dim file As String
    
    'ファイルオブジェクトを生成
    Set FSO = CreateObject("Scripting.FileSystemObject")
    
    '配下全ファイルを対象とする
    file = Dir(folderPath & "\*.*")
    
    '選択したフォルダ配下のファイルを全て読み込む
    Do While file <> ""
        'フォルダ＋ファイル名を取得
        filePath = folderPath & "\" & file
        
            If select_Val = "後方" Then
                'ファイル名最後部に追加
                FSO.GetFile(filePath).Name = Replace(file, ".", "_" & addtext & ".")
                cnt = cnt + 1
            ElseIf select_Val = "先頭" Then
                 'ファイル名先頭に追加
                FSO.GetFile(filePath).Name = Replace(file, file, addtext & "_" & file)
                cnt = cnt + 1
            Else
                '入力項目不足あれば処理抜け
                If select_Val <> "" And addPos_Char <> "" Then
                    '該当ファイルある場合のみ処理
                    If file Like "*" & addPos_Char & "*" Then
                        '置換の場合
                        If select_Val = "置換" Then
                            FSO.GetFile(filePath).Name = Replace(file, addPos_Char, addtext)
                            cnt = cnt + 1
                        ElseIf select_Val = "削除" Then
                            FSO.GetFile(filePath).Name = Replace(file, addPos_Char, "")
                            cnt = cnt + 1
                        Else
                            '（特定の文字の後側に付加）追加文字+元ファイルの文字の値で元ファイル名の一部をreplace
                            FSO.GetFile(filePath).Name = Replace(file, addPos_Char, addPos_Char & "_" & addtext)
                            cnt = cnt + 1
                        End If
                    End If
                Else
                    'OKの場合は入力しなおし、×やcancelした場合は処理抜け
                    If is_Ok Then
                        MsgBox "入力項目不足です", vbExclamation
                        Call DisplayUserForm(FSO, OrgFolderPath, addtext)
                    Else
                        Exit Sub
                    End If
                End If
                
            End If
            
        '次のファイルへ
        file = Dir()
    Loop
        
End Sub
=======
Option Explicit

'ユーザフォームの入力値格納用の変数
Public select_Val As String
Public addPos_Char As String
Public is_Ok As Boolean

'その他変数
Dim addtext As String, filePath As String, OrgFolderPath As String
Dim FSO As Scripting.FileSystemObject
Dim cnt As Long

'ファイル名に文字を追加する機能（先頭のみに追加するやつの上位互換）
Sub ExecuteFileRename()
    Dim folderPath As String
    Dim fileName As String
    Dim folderCnt As Integer
    cnt = 0
    
    'ファイル操作オブジェクト生成
    Set FSO = CreateObject("Scripting.FileSystemObject")
     
    '対象ファイルがあるフォルダを取得し、配下のファイルを取得
    On Error GoTo Catch
    
Again:
    With Application.FileDialog(msoFileDialogFolderPicker)
        .Show
        folderPath = .SelectedItems(1)
    End With
    
    OrgFolderPath = folderPath
    
    'folderPath配下にsubfolderもファイルもなければ対象ファイルなしとメッセージを出す
    fileName = Dir(OrgFolderPath & "\*.*")
    folderCnt = FSO.GetFolder(OrgFolderPath).subFolders.Count
    
    If folderCnt < 1 And fileName = "" Then
        MsgBox "サブフォルダまたはファイルがありません", vbExclamation
        GoTo Again
    Else
        'ダイアログで入力促す
        addtext = InputBox("ファイル名に反映する文字列を入力してください" & vbCrLf & "※削除の場合は適当な値を入力する")
        If addtext <> "" Then
            Call DisplayUserForm(FSO, OrgFolderPath, addtext)
        Else
            Exit Sub
        End If
    End If
      
    'エラーハンドリング
Catch:
    'ファイル選択でキャンセルを押した場合
    If Err.Number = "5" Then
        Exit Sub
    End If

End Sub


Sub DisplayUserForm(FSO As Object, folderPath As String, addtext As String)
    'ユーザフォームを表示
    AddTextForm.Show
    
    If is_Ok Then
        '配下フォルダとファイルについての処理
        Call DoFolders(FSO, folderPath, addtext)
        If cnt > 0 Then
            MsgBox cnt & "件のファイル名の修正が完了しました", vbInformation
        End If
    End If
End Sub


'フォルダに対しての処理
Sub DoFolders(FSO As Object, folderPath As String, addtext As String)
    Dim folder As Object

    Application.ScreenUpdating = False
    
    'フォルダ数分再帰
    For Each folder In FSO.GetFolder(folderPath).subFolders
        Call DoFolders(FSO, folder.Path, addtext)
    Next
    
    'ファイルについての処理
    Call DoFiles(folderPath, addtext)

    Application.ScreenUpdating = True
    
End Sub


'ファイルに対しての処理
Sub DoFiles(folderPath As String, addtext As String)
    Dim file As String
    
    'ファイルオブジェクトを生成
    Set FSO = CreateObject("Scripting.FileSystemObject")
    
    '配下全ファイルを対象とする
    file = Dir(folderPath & "\*.*")
    
    '選択したフォルダ配下のファイルを全て読み込む
    Do While file <> ""
        'フォルダ＋ファイル名を取得
        filePath = folderPath & "\" & file
        
            If select_Val = "後方" Then
                'ファイル名最後部に追加
                FSO.GetFile(filePath).Name = Replace(file, ".", "_" & addtext & ".")
                cnt = cnt + 1
            ElseIf select_Val = "先頭" Then
                 'ファイル名先頭に追加
                FSO.GetFile(filePath).Name = Replace(file, file, addtext & "_" & file)
                cnt = cnt + 1
            Else
                '入力項目不足あれば処理抜け
                If select_Val <> "" And addPos_Char <> "" Then
                    '該当ファイルある場合のみ処理
                    If file Like "*" & addPos_Char & "*" Then
                        '置換の場合
                        If select_Val = "置換" Then
                            FSO.GetFile(filePath).Name = Replace(file, addPos_Char, addtext)
                            cnt = cnt + 1
                        ElseIf select_Val = "削除" Then
                            FSO.GetFile(filePath).Name = Replace(file, addPos_Char, "")
                            cnt = cnt + 1
                        Else
                            '（特定の文字の後側に付加）追加文字+元ファイルの文字の値で元ファイル名の一部をreplace
                            FSO.GetFile(filePath).Name = Replace(file, addPos_Char, addPos_Char & "_" & addtext)
                            cnt = cnt + 1
                        End If
                    End If
                Else
                    'OKの場合は入力しなおし、×やcancelした場合は処理抜け
                    If is_Ok Then
                        MsgBox "入力項目不足です", vbExclamation
                        Call DisplayUserForm(FSO, OrgFolderPath, addtext)
                    Else
                        Exit Sub
                    End If
                End If
                
            End If
            
        '次のファイルへ
        file = Dir()
    Loop
        
End Sub
>>>>>>> f8e7df9072f038bae0d0834b12dac710ab66b9da
