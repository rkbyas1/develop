Option Explicit

Sub SelectA1()
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
        
        'アクティブシートに対してA1セレクト
        With ws
            Range("A1").Select
        End With
        
    Next i

End Sub


Sub OpenWorkbooks()
    Dim file As String, fso As Object
    Dim folderPath As String, filePath As String
    
    'エラーは基本的に無視
    On Error Resume Next
    With Application.FileDialog(msoFileDialogFolderPicker)
        .Show
        folderPath = .SelectedItems(1)
    End With
    
    'エクセルファイルを対象とする
    file = Dir(folderPath & "\*.xl*")
    
    'フォルダ下のファイル全てを対象
    Do While file <> ""
        'オープンしてA1セルに合わせる
        filePath = folderPath & "\" & file
        Workbooks.Open filePath
        
        With ActiveWorkbook
            'A1をselectする関数を呼び出し
            Call SelectA1
            
            Application.DisplayAlerts = False
            Workbooks(file).Save
            Workbooks(file).Close
            Application.DisplayAlerts = True
        End With
        
        '次ファイル読込み
        file = Dir()
    Loop

End Sub

