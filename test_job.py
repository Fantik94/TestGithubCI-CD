from job import average

def test_average():
    assert average([10, 20, 30]) == 20
    assert average([]) == 0
    assert average([1, 2, 3, 4, 5]) == 3
