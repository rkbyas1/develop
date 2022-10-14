Option Explicit
'ユーザフォームの入力値格納用の変数
Public selectValue As String
Public addPosChar As String
Public isOk As Boolean

'ファイル名に文字を追加する機能（先頭のみに追加するやつの上位互換）
Sub Add_text()
    Dim file As String, fso As Object
    Dim folderPath As String, addText As String, filePath As String
    Dim cnt As Long
    cnt = 0
    
    '対象ファイルがあるフォルダを取得し、配下のファイルを取得
    On Error GoTo out
    With Application.FileDialog(msoFileDialogFolderPicker)
        .Show
        folderPath = .SelectedItems(1)
    End With
    
    '配下全ファイルを対象とする
    file = Dir(folderPath & "\*.*")
    
    'ファイルがあれば、付加する文字列を指定してもらう
    If file <> "" Then
        addText = InputBox("ファイル名に反映する文字を入力してください")
        If addText <> "" Then
again:
            'ユーザフォームを表示
            AddTextForm.Show
        Else
            Exit Sub
        End If
        
        'ファイルオブジェクトを生成
        Set fso = CreateObject("Scripting.FileSystemObject")
        
        Application.ScreenUpdating = False
        
        If Not isOk Then Exit Sub
        
        '選択したフォルダ配下のファイルを全て読み込む
        Do While file <> ""
            'フォルダ＋ファイル名を取得
            filePath = folderPath & "\" & file
            
                If selectValue = "後方" Then
                    'ファイル名最後部に追加
                    fso.GetFile(filePath).Name = Replace(file, ".", "_" & addText & ".")
                    cnt = cnt + 1
                ElseIf selectValue = "先頭" Then
                     'ファイル名先頭に追加
                    fso.GetFile(filePath).Name = Replace(file, file, addText & "_" & file)
                    cnt = cnt + 1
                Else
                    '文字指定の場合に入力項目不足あれば処理抜け
                    If selectValue <> "" And addPosChar <> "" Then
                        '該当ファイルある場合のみ処理
                        If file Like "*" & addPosChar & "*" Then
                            '置換の場合
                            If selectValue = "置換" Then
                                fso.GetFile(filePath).Name = Replace(file, addPosChar, addText)
                            Else
                                '（特定の文字の後側に付加）追加文字+元ファイルの文字の値で元ファイル名の一部をreplace
                                fso.GetFile(filePath).Name = Replace(file, addPosChar, addPosChar & "_" & addText)
                            End If
                            cnt = cnt + 1
                        End If
                    Else
                        'OKの場合は入力しなおし、×やcancelした場合は処理抜け
                        If isOk Then
                            MsgBox "入力項目が不足しています", vbExclamation
                            'やり直し
                            GoTo again
                        Else
                            Exit Sub
                        End If
                    End If
                    
                End If
                
            
            '次のファイルへ
            file = Dir()
        Loop
        
        Application.ScreenUpdating = True
        
        MsgBox cnt & "件のファイル名へ追加が完了しました", vbInformation
    Else
        MsgBox "配下に対象ファイルがありません", vbInformation
        Exit Sub
    End If
    
    'addtextを入力しなければ以降の処理をスキップ
    If addText = "" Then
        MsgBox "追加文字列が入力されませんでした", vbInformation
        Exit Sub
    End If
    
out:

End Sub


'ファイル名から特定の文字列を除去する
Sub Remove_text()
    Dim file As String, cnt As Long, fso As Object, errCnt As Integer
    Dim folderPath As String, rmvText As String, filePath As String
    
    '対象ファイルがあるフォルダを取得し、xlsxファイルを取得
    On Error GoTo out
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
        fso.GetFile(filePath).Name = Replace(file, rmvText, "")
        
        '変換できないものをカウント
        If Err.Number = 58 Then
            errCnt = errCnt + 1
        Else
            cnt = cnt + 1
        End If
        
        '次のファイルへ
        file = Dir()
    Loop
    
    Application.ScreenUpdating = True
  
    '終了ダイアログ
    MsgBox cnt & "件のファイル名の修正が完了しました", vbInformation
  
'エラーハンドリング
out:
    'ファイルダイアログでキャンセルまたは×とした場合
    If Err.Number = 5 Then
        Exit Sub
    End If
    


End Sub

