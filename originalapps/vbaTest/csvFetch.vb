Option Explicit

Sub CsvToExcel()
    Dim myFileName As Variant
    Dim Fcn As Long
    Dim i As Long
    Dim buf As String
    Dim tmp As Variant

    myFileName = Application.GetOpenFilename(FileFilter:="CSVファイル(*.csv),*.csv", _
                                                                          Title:="CSVファイルの選択")
    If myFileName = False Then
          Exit Sub
    End If

'    With Worksheets("Sheet1")
'
'        Open myFileName For Input As #1
'
'        Do Until EOF(1)
'            Line Input #1, buf
'            Fcn = Fcn + 1
'            tmp = Split(buf, ",")
'
'        '書き出し
'            For i = LBound(tmp) To UBound(tmp)
'                .Cells(Fcn + 1, i + 1).Value = tmp(i)
'            Next i
'
'        Loop
'        Close #1
'
'    End With
    
    Open myFileName For Input As #1
    Dim index As Long
    Dim data() As String
    Dim row_no As Long
    Dim added As Boolean
    index = 1
    row_no = 1
    added = False
    Fcn = 1
    
    Do Until EOF(1)
        Line Input #1, buf
        Fcn = Fcn + 1
        tmp = Split(buf, ",")
        
        '書き出し
        For i = LBound(tmp) To UBound(tmp)
            '前行と同日付なら追加
            If row_no <> 1 Then
                If data(row_no - 2) = tmp(6) Then
                    'Excelへの書込関数を呼び出す
                    Call WriteToExcel(i, Fcn, tmp, index)
                Else
                    '改シート
                    If Not added Then
                        'ヘッダデータ取得、スタイル修正（関数呼び出し）
                        Call AddStyles(Fcn)
                        ' シート追加
                        Worksheets.Add
                        added = True
                        row_no = 1
                        index = 1
                        i = i - 1
                        Fcn = 2
                    End If
                End If
            Else
                'Excelへの書込関数を呼び出す
                Call WriteToExcel(i, Fcn, tmp, index)
            End If
        Next i
        '要素追加管理
        If row_no = 1 Then
            ReDim data(1)
            data(0) = tmp(6)
        Else
            ReDim Preserve data(UBound(data) + 1)
            data(UBound(data) - 1) = tmp(6)
        End If
        added = False
        row_no = row_no + 1
        'Sheets(1).Name = "0000" + CStr(index)
        Sheets(1).Name = tmp(6)
        index = index + 1 '行番号用
    Loop
    'ヘッダデータ取得、スタイル修正（関数呼び出し）
    Sheets(1).Cells(12, 5) = "番号："
    Sheets(1).Cells(12, 6) = tmp(6)
    Call AddStyles(Fcn + 1)
    Close #1
End Sub


'Excelへの書込関数
Sub WriteToExcel(i As Long, Fcn As Long, tmp As Variant, index As Long)
    With Sheets(1)
        '番号は明細に追加しない
        If i = 6 Then
            Cells(12, 5) = "番号："
            Cells(12, 6) = tmp(6)
        '行番号はシートごとにリセットした値
        ElseIf i = 0 Then
            Cells(Fcn, i + 1).Value = index
        'その他の値は順番に書き込んでいく
        Else
            Cells(Fcn, i + 1).Value = tmp(i)
        End If
    End With
End Sub


'スタイル修正用関数
Sub AddStyles(Fcn As Long)
    With Sheets(1)
        ' 合計を算出
        Cells(Fcn, 5) = "合計："
        Cells(Fcn, 6) = WorksheetFunction.Sum(Range(Cells(2, 6), Cells(Fcn, 6)))
        '番号を振る
'        Cells(Fcn + 1, 5) = "番号："
'        Cells(Fcn + 1, 6) = tmp(6)
        '金額形式の指定
        Range(Cells(2, 4), Cells(Fcn, 6)).NumberFormatLocal = "#,###"
        'その他スタイルの設定
        Range(Cells(2, 1), Cells(Fcn - 1, 1)).Interior.ColorIndex = 20
        Range(Cells(2, 1), Cells(Fcn - 1, 6)).Borders(xlEdgeBottom).LineStyle = xlContinuous
        Range(Cells(2, 1), Cells(Fcn - 1, 6)).Borders(xlEdgeTop).LineStyle = xlContinuous
        Range(Cells(2, 1), Cells(Fcn - 1, 6)).Borders(xlInsideHorizontal).LineStyle = xlContinuous
        Range(Cells(Fcn, 5), Cells(Fcn, 6)).Borders(xlEdgeBottom).LineStyle = xlDouble
        Range(Cells(2, 1), Cells(Fcn, 6)).EntireRow.RowHeight = 16
        Columns(1).ColumnWidth = 3
        Columns(2).ColumnWidth = 15
        Columns(3).ColumnWidth = 10
        Columns(4).ColumnWidth = 5
        Columns(5).ColumnWidth = 5
        Columns(6).ColumnWidth = 10
        Columns(1).HorizontalAlignment = xlCenter
    End With
End Sub



