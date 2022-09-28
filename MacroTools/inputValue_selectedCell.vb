Option Explicit

'ユーザフォームの入力値格納用の変数
Public txt_val As String
Public cell_val As String
Public bool_cancel As Boolean

Sub inputvalue()
    Dim file As String, fso As Object
    Dim folderPath As String, addText As String, cellAd As String, filePath As String
    
    '対象ファイルがあるフォルダを取得し、配下のファイルを取得
    On Error GoTo out
    With Application.FileDialog(msoFileDialogFolderPicker)
        .Show
        .Title = "フォルダ選択"
        folderPath = .SelectedItems(1)
    End With
    
    '配下エクセルファイルを対象とする
    file = Dir(folderPath & "\*.xls*")

    '対象ファイルがあれば
    If file <> "" Then
        '入力用ユーザフォームを表示し、入力を促す
        'セル番地と入力値を変数（txt_val、cell_val）で受取る
        inputForm.Show
        
        'キャンセルなら何もせず終了
        If bool_cancel Then
            Exit Sub
        'OKの場合で両方入力ある場合は反映処理に進む
        ElseIf txt_val <> "" And cell_val <> "" Then
            '入力値チェック
            Dim res As Boolean
            res = CheckVal(txt_val, cell_val)
            
            'エラーでなければ処理を継続
            If Not res Then
                Application.ScreenUpdating = False
                
                '選択したフォルダ配下のファイルを全て読み込む
                Do While file <> ""
                    'ファイルを開き、指定したセルに値を入力し、保存して閉じる
                    filePath = folderPath & "\" & file
                    Workbooks.Open (filePath)
                    '書込み関数呼び出し
                    Call write_value(txt_val, cell_val)
                    '保存して閉じる
                    ActiveWorkbook.Close SaveChanges:=True
                    
                    '次のファイルへ
                    file = Dir()
                Loop
                
                Application.ScreenUpdating = True
            Else
                MsgBox "反映先セルの指定が不正です", vbExclamation
            End If
            
        'OKの場合で片方入力ない場合
        Else
            MsgBox "入力値に不足があるため反映できません。", vbExclamation, "入力不正"
        End If
    'ファイルなければメッセージ出して終了
    Else
        MsgBox "配下にExcelファイルがありません", vbInformation, "確認"
        Exit Sub
    End If
    
out:
    Exit Sub
End Sub


'書込み用関数
Sub write_value(txt_val, cell_val)
    Dim ws As Worksheet
    Dim sc As Long
    Dim i As Integer
    
    'ブック内の全シートカウント
    sc = ActiveWorkbook.Sheets.Count
    
    For i = 1 To sc
        '先頭のシートから見ていく
        Set ws = Worksheets(i)
        '一つずつアクティブにする
        ws.Activate
        
        'アクティブシートのセルに入力
        With ws
            Range(cell_val).value = txt_val
        End With
        
    Next i

End Sub

'入力値チェック
Function CheckVal(txt_val, cell_val) As Boolean
    'セルを数値だけまたは文字列だけで入力した場合はエラー
    If IsNumeric(cell_val) Or Not cell_val Like "*[!a-zA-Zａ-ｚＡ-Ｚ]*" Then
        CheckVal = True
    Else
        CheckVal = False
    End If

End Function